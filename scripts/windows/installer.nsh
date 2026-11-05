; Prism for Windows (Windows build, 0.50): register Prism as a web browser so it appears in Settings → Default apps.
; Nothing here takes over http/https: Windows only lets the person choose the default browser themselves.
!macro customInstall
  WriteRegStr SHCTX "Software\Clients\StartMenuInternet\Prism" "" "Prism"
  WriteRegStr SHCTX "Software\Clients\StartMenuInternet\Prism\DefaultIcon" "" "$INSTDIR\Prism.exe,0"
  WriteRegStr SHCTX "Software\Clients\StartMenuInternet\Prism\shell\open\command" "" '"$INSTDIR\Prism.exe"'
  WriteRegStr SHCTX "Software\Clients\StartMenuInternet\Prism\Capabilities" "ApplicationName" "Prism"
  WriteRegStr SHCTX "Software\Clients\StartMenuInternet\Prism\Capabilities" "ApplicationDescription" "A Chromium browser with sleeping tabs"
  WriteRegStr SHCTX "Software\Clients\StartMenuInternet\Prism\Capabilities" "ApplicationIcon" "$INSTDIR\Prism.exe,0"
  WriteRegStr SHCTX "Software\Clients\StartMenuInternet\Prism\Capabilities\URLAssociations" "http" "PrismURL"
  WriteRegStr SHCTX "Software\Clients\StartMenuInternet\Prism\Capabilities\URLAssociations" "https" "PrismURL"
  WriteRegStr SHCTX "Software\Clients\StartMenuInternet\Prism\Capabilities\StartMenu" "StartMenuInternet" "Prism"
  WriteRegStr SHCTX "Software\Classes\PrismURL" "" "Prism Web Document"
  WriteRegStr SHCTX "Software\Classes\PrismURL\DefaultIcon" "" "$INSTDIR\Prism.exe,0"
  WriteRegStr SHCTX "Software\Classes\PrismURL\shell\open\command" "" '"$INSTDIR\Prism.exe" "%1"'
  WriteRegStr SHCTX "Software\RegisteredApplications" "Prism" "Software\Clients\StartMenuInternet\Prism\Capabilities"
!macroend

!macro customUnInstall
  DeleteRegKey SHCTX "Software\Clients\StartMenuInternet\Prism"
  DeleteRegKey SHCTX "Software\Classes\PrismURL"
  DeleteRegValue SHCTX "Software\RegisteredApplications" "Prism"
!macroend
