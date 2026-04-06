$out = 'D:\Projects\toolkit-pro\testing\server-suite.out.log'
$err = 'D:\Projects\toolkit-pro\testing\server-suite.err.log'
$existingBase = 'http://127.0.0.1:3015'
$startedServer = $false

Remove-Item $out, $err -Force -ErrorAction SilentlyContinue

$proc = $null

try {
  & '.\testing\generate_pdf_sample_inputs.ps1'

  $healthOk = $false
  try {
    $health = Invoke-RestMethod -Uri "$existingBase/api/health" -TimeoutSec 5
    $healthOk = $health.ok -eq $true
  } catch {
    $healthOk = $false
  }

  if ($healthOk) {
    $env:PDF_SMOKE_API_BASE = $existingBase
  } else {
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
    $env:PDF_SMOKE_API_BASE = "http://127.0.0.1:$port"
  }

  python '.\testing\run_pdf_smoke_tests.py'
}
finally {
  Remove-Item Env:\PDF_SMOKE_API_BASE -ErrorAction SilentlyContinue

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
