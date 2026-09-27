[Code]
{ Setup event functions: wire the pages together and run the pre- and post-install steps.
  Page order: Welcome, Game client, Already installed (maintenance), Components, Tasks, Other mods, Ready. }

procedure InitializeWizard;
begin
  OtmCatalogInit;
  OtmClientPageInit(wpWelcome);
  OtmMaintenancePageInit(OtmClientPage.ID);
  OtmComponentsPageInit;
  OtmOtherModsPageInit(wpSelectTasks);
  if WizardSilent and (OtmClientPage.SelectedValueIndex >= 0) then
    OtmClientPageNext;
end;

function ShouldSkipPage(PageID: Integer): Boolean;
begin
  Result := False;
  if PageID = OtmMaintenancePage.ID then
    Result := OtmMaintenanceSkip
  else if PageID = OtmOtherModsPage.ID then
    Result := OtmOtherModsSkip;
end;

procedure CurPageChanged(CurPageID: Integer);
begin
  if CurPageID = OtmMaintenancePage.ID then
    OtmMaintenancePageShow
  else if CurPageID = wpSelectComponents then
    OtmComponentsPageShow
  else if CurPageID = OtmOtherModsPage.ID then
    OtmOtherModsPageShow
  else if (CurPageID = wpFinished) and OtmHasClient then
  begin
    WizardForm.FinishedLabel.Caption := FmtMessage(CustomMessage('OtmFinished'), [OtmClient.ModsDir]);
    WizardForm.AdjustLabelHeight(WizardForm.FinishedLabel);
  end;
end;

function NextButtonClick(CurPageID: Integer): Boolean;
begin
  Result := True;
  if CurPageID = OtmClientPage.ID then
    Result := OtmClientPageNext
  else if CurPageID = OtmMaintenancePage.ID then
    Result := OtmMaintenancePageNext
  else if CurPageID = wpSelectComponents then
    Result := OtmComponentsPageNext
  else if (CurPageID = wpSelectTasks) and WizardIsTaskSelected('removeothers') then
    WizardSelectTasks('backup')
  else if CurPageID = OtmOtherModsPage.ID then
    Result := OtmOtherModsPageNext;
end;

procedure CancelButtonClick(CurPageID: Integer; var Cancel, Confirm: Boolean);
begin
  if OtmExitWithoutPrompt then
  begin
    Cancel := True;
    Confirm := False;
  end;
end;

function UpdateReadyMemo(Space, NewLine, MemoUserInfoInfo, MemoDirInfo, MemoTypeInfo, MemoComponentsInfo, MemoGroupInfo, MemoTasksInfo: String): String;
begin
  Result := CustomMessage('OtmReadyClient') + NewLine + Space + OtmClient.Path + ' (' + OtmClient.Version + ')' + NewLine +
    Space + OtmClient.ModsDir;
  if MemoTypeInfo <> '' then
    Result := Result + NewLine + NewLine + MemoTypeInfo;
  if MemoComponentsInfo <> '' then
    Result := Result + NewLine + NewLine + MemoComponentsInfo;
  if MemoTasksInfo <> '' then
    Result := Result + NewLine + NewLine + MemoTasksInfo;
end;

procedure RegisterPreviousData(PreviousDataKey: Integer);
begin
  OtmRegisterClientData(PreviousDataKey);
end;

{ Before any file is copied: the game must be closed, then snapshot, remove our previous files and, when
  reviewed and confirmed, the other mods. A failed snapshot stops «remove other mods». }
function PrepareToInstall(var NeedsRestart: Boolean): String;
var
  Progress: TOutputMarqueeProgressWizardPage;
  WantBackup, RemoveOthers: Boolean;
begin
  Result := '';
  if not OtmHasClient then
  begin
    Result := CustomMessage('OtmClientChoose');
    Exit;
  end;
  if OtmClientRunning(OtmClient) then
  begin
    Result := CustomMessage('OtmClientRunning');
    Exit;
  end;
  RemoveOthers := WizardIsTaskSelected('removeothers');
  WantBackup := WizardIsTaskSelected('backup') or RemoveOthers;
  Progress := CreateOutputMarqueeProgressPage(CustomMessage('OtmPrepareCaption'), CustomMessage('OtmPrepareDescription'));
  Progress.Show;
  try
    Progress.Animate;
    OtmSaveClientState(OtmClient);
    if WantBackup then
    begin
      Progress.SetText(CustomMessage('OtmStatusBackup'), OtmClient.ModsDir);
      if OtmCreateSnapshot(OtmClient) = '' then
      begin
        if RemoveOthers then
        begin
          Result := CustomMessage('OtmBackupFailedStop');
          Exit;
        end;
        if SuppressibleMsgBox(CustomMessage('OtmBackupFailed'), mbConfirmation, MB_YESNO, IDYES) <> IDYES then
        begin
          Result := CustomMessage('OtmBackupFailedStop');
          Exit;
        end;
      end;
    end;
    Progress.SetText(CustomMessage('OtmStatusCleanup'), OtmClient.ModsDir);
    OtmRemoveOurFiles(OtmClient);
    if RemoveOthers then
    begin
      Progress.SetText(CustomMessage('OtmStatusOthers'), OtmClient.ModsDir);
      OtmRemoveOtherMods;
    end;
  finally
    Progress.Hide;
  end;
end;

procedure CurStepChanged(CurStep: TSetupStep);
begin
  if CurStep = ssPostInstall then
  begin
    OtmWriteManifest(OtmClient, WizardSelectedComponents(False));
    OtmPruneSnapshots(OtmClient);
  end;
end;
