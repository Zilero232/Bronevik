[Code]
{ Uninstall: for every client we installed into, offer to restore the newest snapshot, remove our files
  (manifest + our package names only) and, if asked, our config and binding. Then drop our state. Inno
  itself removes the files it logged. Silent uninstall keeps snapshots unrestored and configs in place. }

procedure OtmUninstallClient(const StateDir: String);
var
  Client: TOtmClient;
  Snapshot: String;
begin
  if not OtmLoadClientState(StateDir, Client) then
    Exit;
  Log('Uninstalling from ' + Client.Path);
  Snapshot := OtmLatestSnapshot(Client);
  if (Snapshot <> '') and (SuppressibleMsgBox(FmtMessage(CustomMessage('OtmUninstallRestore'), [Client.Path, OtmSnapshotDate(Snapshot)]),
    mbConfirmation, MB_YESNO or MB_DEFBUTTON2, IDNO) = IDYES) then
    OtmRestoreSnapshot(Client, Snapshot);
  OtmRemoveOurFiles(Client);
  if DirExists(OtmConfigsDir(Client.Path)) and (SuppressibleMsgBox(FmtMessage(CustomMessage('OtmUninstallConfigs'), [Client.Path]),
    mbConfirmation, MB_YESNO or MB_DEFBUTTON2, IDNO) = IDYES) then
    OtmDeleteEntry(OtmConfigsDir(Client.Path));
end;

procedure CurUninstallStepChanged(CurUninstallStep: TUninstallStep);
var
  States: TArrayOfString;
  I: Integer;
begin
  if CurUninstallStep = usUninstall then
  begin
    States := OtmListEntries(OtmClientsStateDir);
    for I := 0 to GetArrayLength(States) - 1 do
      OtmUninstallClient(OtmClientsStateDir + '\' + States[I]);
    OPENWG_DllUnload();
    OPENWG_DllDelete();
  end
  else if CurUninstallStep = usPostUninstall then
  begin
    DelTree(OtmClientsStateDir, True, True, True);
    RemoveDir(OtmStateRoot);
  end;
end;
