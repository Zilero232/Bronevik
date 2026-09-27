[Code]
{ «Already installed» page, shown when the chosen client has our manifest or a snapshot:
    install / update     continue to the components
    rollback             restore the newest snapshot, then close setup
    collect logs         zip on the desktop, stay on the page }

const
  OtmActionInstall = 0;
  OtmActionRollback = 1;
  OtmActionLogs = 2;

var
  OtmMaintenancePage: TInputOptionWizardPage;
  OtmMaintenanceGap: Integer;
  OtmMaintenanceSnapshot: String;
  OtmExitWithoutPrompt: Boolean;

procedure OtmMaintenancePageInit(AfterID: Integer);
begin
  OtmMaintenancePage := CreateInputOptionPage(AfterID, CustomMessage('OtmMaintenanceCaption'),
    CustomMessage('OtmMaintenanceDescription'), '', True, False);
  OtmMaintenancePage.Add(CustomMessage('OtmMaintenanceInstall'));
  OtmMaintenancePage.Add(CustomMessage('OtmMaintenanceNoBackup'));
  OtmMaintenancePage.Add(CustomMessage('OtmMaintenanceLogs'));
  OtmMaintenancePage.SelectedValueIndex := OtmActionInstall;
  OtmMaintenancePage.SubCaptionLabel.WordWrap := True;
  OtmMaintenanceGap := OtmMaintenancePage.CheckListBox.Top - OtmMaintenancePage.SubCaptionLabel.Top - OtmMaintenancePage.SubCaptionLabel.Height;
end;

function OtmMaintenanceSkip: Boolean;
begin
  OtmMaintenanceSnapshot := '';
  Result := not OtmHasClient;
  if Result then
    Exit;
  OtmMaintenanceSnapshot := OtmLatestSnapshot(OtmClient);
  Result := not OtmIsInstalled(OtmClient) and (OtmMaintenanceSnapshot = '');
end;

procedure OtmMaintenancePageShow;
var
  Installed: String;
begin
  Installed := GetIniString('install', 'date', '-', OtmManifestPath(OtmClient));
  OtmMaintenancePage.SubCaptionLabel.Caption := FmtMessage(CustomMessage('OtmMaintenanceSubCaption'), [Installed, OtmClient.Path]);
  WizardForm.AdjustLabelHeight(OtmMaintenancePage.SubCaptionLabel);
  OtmMaintenancePage.CheckListBox.Top := OtmMaintenancePage.SubCaptionLabel.Top + OtmMaintenancePage.SubCaptionLabel.Height + OtmMaintenanceGap;
  if OtmMaintenanceSnapshot <> '' then
    OtmMaintenancePage.CheckListBox.ItemCaption[OtmActionRollback] :=
      FmtMessage(CustomMessage('OtmMaintenanceRollback'), [OtmSnapshotDate(OtmMaintenanceSnapshot)])
  else
    OtmMaintenancePage.CheckListBox.ItemCaption[OtmActionRollback] := CustomMessage('OtmMaintenanceNoBackup');
  OtmMaintenancePage.CheckListBox.ItemEnabled[OtmActionRollback] := OtmMaintenanceSnapshot <> '';
end;

procedure OtmExitSetup;
begin
  OtmExitWithoutPrompt := True;
  WizardForm.Close;
end;

function OtmRollback: Boolean;
var
  When: String;
begin
  Result := False;
  When := OtmSnapshotDate(OtmMaintenanceSnapshot);
  if MsgBox(FmtMessage(CustomMessage('OtmRollbackConfirm'), [When, OtmSnapshotTargets(OtmClient)]), mbConfirmation, MB_YESNO or MB_DEFBUTTON2) <> IDYES then
    Exit;
  if OtmClientRunning(OtmClient) then
  begin
    MsgBox(CustomMessage('OtmClientRunning'), mbError, MB_OK);
    Exit;
  end;
  if OtmRestoreSnapshot(OtmClient, OtmMaintenanceSnapshot) then
  begin
    DeleteFile(OtmManifestPath(OtmClient));
    MsgBox(FmtMessage(CustomMessage('OtmRollbackDone'), [When]), mbInformation, MB_OK);
    Result := True;
  end
  else
    MsgBox(FmtMessage(CustomMessage('OtmRollbackFailed'), [ExpandConstant('{log}')]), mbError, MB_OK);
end;

procedure OtmCollectLogsInteractive;
var
  Zip: String;
begin
  Zip := OtmCollectLogs(OtmClient);
  if Zip = '' then
    MsgBox(CustomMessage('OtmLogsFailed'), mbError, MB_OK)
  else
  begin
    MsgBox(FmtMessage(CustomMessage('OtmLogsDone'), [Zip]), mbInformation, MB_OK);
    OtmRevealFile(Zip);
  end;
end;

{ Next on the page: only «install» moves on. }
function OtmMaintenancePageNext: Boolean;
begin
  Result := False;
  case OtmMaintenancePage.SelectedValueIndex of
    OtmActionInstall: Result := True;
    OtmActionRollback:
      if OtmRollback then
        OtmExitSetup;
    OtmActionLogs: OtmCollectLogsInteractive;
  end;
end;
