$out = 'D:\Projects\toolkit-pro\testing\server-final-checks.out.log'
$err = 'D:\Projects\toolkit-pro\testing\server-final-checks.err.log'
$existingBase = 'http://127.0.0.1:3015'
$startedServer = $false

Remove-Item $out, $err -Force -ErrorAction SilentlyContinue

$proc = $null

try {
  $healthOk = $false
  try {
    $health = Invoke-RestMethod -Uri "$existingBase/api/health" -TimeoutSec 5
    $healthOk = $health.ok -eq $true
  } catch {
    $healthOk = $false
  }

  if ($healthOk) {
    $port = 3015
  } else {
  }

  if (-not $healthOk) {
    $proc = Start-Process -FilePath node `
      -ArgumentList '.\node_modules\tsx\dist\cli.mjs', 'server.ts' `
      -WorkingDirectory 'D:\Projects\toolkit-pro' `
      -PassThru `
      -RedirectStandardOutput $out `
      -RedirectStandardError $err

    $startedServer = $true
    Start-Sleep -Seconds 25
    $stdout = if (Test-Path $out) { Get-Content $out -Raw } else { '' }
    if ($stdout -match 'http://localhost:(\d+)') {
      $port = $Matches[1]
    } else {
      $port = $null
      foreach ($candidate in 3000..3025) {
        try {
          $healthProbe = Invoke-RestMethod -Uri "http://127.0.0.1:$candidate/api/health" -TimeoutSec 3
          if ($healthProbe.ok -eq $true) {
            $port = $candidate
            break
          }
        } catch {
        }
      }
      if (-not $port) {
        throw 'Could not detect server port from stdout log or health probe.'
      }
    }
  }

  $base = "http://127.0.0.1:$port"
  $health = Invoke-RestMethod -Uri "$base/api/health" -TimeoutSec 30

  $contactPayload = @{
    name = 'Final Check'
    email = 'final-check@example.com'
    type = 'feedback'
    subject = 'Final smoke pass'
    message = 'Testing latest source on current server.'
  } | ConvertTo-Json
  $contact = Invoke-RestMethod -Uri "$base/api/contact" -Method Post -ContentType 'application/json' -Body $contactPayload -TimeoutSec 30

  $admin = Invoke-RestMethod -Uri "$base/api/admin/overview?admin_user=admin&admin_pass=admin" -TimeoutSec 30

  $themeId = 'bluevinza-corporate-studio'
  $themeHtml = Invoke-WebRequest -UseBasicParsing -Uri "$base/theme-preview/$themeId" -TimeoutSec 30
  $themePreviewOk = $themeHtml.Content -match "/theme-preview/$themeId/assets/"

  [pscustomobject]@{
    health = $health
    contact = $contact
    adminRecentUsage = @($admin.recentUsage).Count
    adminMessages = @($admin.messages).Count
    themePreviewStatus = $themeHtml.StatusCode
    themePreviewRewrittenAssets = $themePreviewOk
  } | ConvertTo-Json -Depth 6
}
finally {
  if ($startedServer -and $proc -and -not $proc.HasExited) {
    Stop-Process -Id $proc.Id -Force
  }

  Write-Host '---STDOUT---'
  if (Test-Path $out) {
    Get-Content $out -Tail 80
  }

  Write-Host '---STDERR---'
  if (Test-Path $err) {
    Get-Content $err -Tail 80
  }
}
