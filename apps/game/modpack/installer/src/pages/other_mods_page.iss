[Code]
{ «Remove other mods» review page, shown only when that task is ticked: the exact list of files and
  folders from mods\<version> and res_mods\<version> that are not ours. Nothing is removed without this
  page and a confirmation, and a snapshot is always taken first (setup_events.iss). }

var
  OtmOtherModsPage: TOutputMsgMemoWizardPage;
  OtmOtherModsList: TArrayOfString;

procedure OtmOtherModsPageInit(AfterID: Integer);
begin
  OtmOtherModsPage := CreateOutputMsgMemoPage(AfterID, CustomMessage('OtmOtherModsCaption'),
    CustomMessage('OtmOtherModsDescription'), CustomMessage('OtmOtherModsSubCaption'), '');
end;

function OtmOtherModsSkip: Boolean;
begin
  Result := not OtmHasClient or not WizardIsTaskSelected('removeothers');
end;

procedure OtmOtherModsPageShow;
begin
  OtmOtherModsList := OtmOtherMods(OtmClient);
  if GetArrayLength(OtmOtherModsList) = 0 then
    OtmOtherModsPage.RichEditViewer.Lines.Text := CustomMessage('OtmOtherModsEmpty')
  else
    OtmOtherModsPage.RichEditViewer.Lines.Text := StringJoin(#13#10, OtmOtherModsList);
end;

function OtmOtherModsPageNext: Boolean;
begin
  Result := (GetArrayLength(OtmOtherModsList) = 0) or
    (MsgBox(FmtMessage(CustomMessage('OtmOtherModsConfirm'), [IntToStr(GetArrayLength(OtmOtherModsList))]),
      mbConfirmation, MB_YESNO or MB_DEFBUTTON2) = IDYES);
end;

{ Removes exactly the reviewed list. }
procedure OtmRemoveOtherMods;
var
  I: Integer;
begin
  for I := 0 to GetArrayLength(OtmOtherModsList) - 1 do
    OtmDeleteEntry(OtmOtherModsList[I]);
end;
