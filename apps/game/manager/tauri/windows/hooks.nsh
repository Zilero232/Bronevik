; NSIS hooks of the manager's installer (tauri.conf.json > bundle > windows > nsis > installerHooks).
; Uninstalling the app offers to remove the modpack from every game client it manages: only our packages
; (manifest + our file masks), like the old Inno Setup uninstaller in silent mode. Other mods and the mod
; settings stay. Silent runs (updates, /S) keep the modpack.

!macro NSIS_HOOK_PREUNINSTALL
  ${If} $LANGUAGE == 1049
    MessageBox MB_YESNO|MB_ICONQUESTION "Удалить модпак «Три отметки» из клиентов игры? Чужие моды и настройки мода останутся." /SD IDNO IDNO otm_keep_modpack
  ${Else}
    MessageBox MB_YESNO|MB_ICONQUESTION "Remove the Three Marks modpack from the game clients? Other mods and the mod settings stay." /SD IDNO IDNO otm_keep_modpack
  ${EndIf}
  ExecWait '"$INSTDIR\otmetki-manager.exe" --uninstall-mods'
  otm_keep_modpack:
!macroend
