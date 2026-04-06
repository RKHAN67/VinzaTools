$testingDir = 'D:\Projects\toolkit-pro\testing'

function Safe-ReleaseComObject {
  param($ComObject)
  if ($null -ne $ComObject) {
    try {
      [System.Runtime.InteropServices.Marshal]::ReleaseComObject($ComObject) | Out-Null
    } catch {
      # ignore COM cleanup issues during smoke test setup
    }
  }
}

function Safe-ComCall {
  param([scriptblock]$Action)
  try {
    & $Action
  } catch {
    # ignore shutdown timing issues from Office COM apps
  }
}

$xlsxPath = Join-Path $testingDir 'sample_input.xlsx'
$pptxPath = Join-Path $testingDir 'sample.pptx'
$htmlPath = Join-Path $testingDir 'sample.html'

@"
from openpyxl import Workbook

wb = Workbook()
ws = wb.active
ws.title = "Status"
ws["A1"] = "Tool"
ws["B1"] = "Status"
ws["A2"] = "Excel to PDF"
ws["B2"] = "Ready"
ws["A3"] = "Checked On"
ws["B3"] = "${([DateTime]::Now.ToString('yyyy-MM-dd HH:mm:ss'))}"
wb.save(r"$xlsxPath")
"@ | python -

try {
  $powerPoint = New-Object -ComObject PowerPoint.Application
  $presentation = $powerPoint.Presentations.Add()
  if ($presentation -and $presentation.Slides) {
    $slide = $presentation.Slides.Add(1, 12)
    $textbox = $slide.Shapes.AddTextbox(1, 72, 72, 620, 120)
    $textbox.TextFrame.TextRange.Text = 'Toolora PDF Conversion Test'
    $textbox.TextFrame.TextRange.Font.Size = 28
    $presentation.SaveAs($pptxPath)
  } elseif (-not (Test-Path $pptxPath)) {
    throw 'Could not create PowerPoint sample file.'
  }
} catch {
  if (-not (Test-Path $pptxPath)) {
    throw
  }
} finally {
  Safe-ComCall { if ($presentation) { $presentation.Close() } }
  Safe-ComCall { if ($powerPoint) { $powerPoint.Quit() } }
  Safe-ReleaseComObject $textbox
  Safe-ReleaseComObject $slide
  Safe-ReleaseComObject $presentation
  Safe-ReleaseComObject $powerPoint
  [GC]::Collect()
  [GC]::WaitForPendingFinalizers()
}

@'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Toolora HTML Test</title>
    <style>
      body {
        font-family: "Segoe UI", sans-serif;
        padding: 40px;
        color: #1f2937;
      }
      h1 {
        color: #e11d48;
        margin-bottom: 12px;
      }
      p {
        line-height: 1.7;
      }
    </style>
  </head>
  <body>
    <h1>Toolora HTML Test</h1>
    <p>This sample file is generated automatically for HTML to PDF smoke testing.</p>
  </body>
</html>
'@ | Set-Content -Path $htmlPath -Encoding utf8

Write-Host "Generated sample files:"
Write-Host $xlsxPath
Write-Host $pptxPath
Write-Host $htmlPath
