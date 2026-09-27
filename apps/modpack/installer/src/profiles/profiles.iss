[Code]
{ Component profiles. A profile is an .ini in the /SAVEINF format ([Setup] SetupType, Components), so the
  same file also works as `otmetki-setup.exe /LOADINF=profile.ini` for silent installs. Profiles hold
  components only: tasks such as «remove other mods» are never loaded from a file. The last choice is
  preselected by Inno itself (UsePreviousSetupType). }

const
  OtmProfileSection = 'Setup';

function OtmProfilesDir: String;
begin
  Result := ExpandConstant('{userdocs}\TriOtmetki\Profiles');
end;

procedure OtmSelectCustomType;
var
  I: Integer;
begin
  for I := 0 to WizardForm.TypesCombo.Items.Count - 1 do
    if WizardForm.TypesCombo.Items[I] = CustomMessage('OtmType_custom') then
    begin
      WizardForm.TypesCombo.ItemIndex := I;
      WizardForm.TypesCombo.OnChange(WizardForm.TypesCombo);
      Exit;
    end;
end;

{ Ticks exactly Components (plus dependencies and required ones); returns the names it did not know. }
function OtmApplySelection(const Components: String): String;
var
  Items: TArrayOfString;
  Target, Change: String;
  I: Integer;
begin
  Result := '';
  Items := OtmCsvItems(Components);
  for I := 0 to GetArrayLength(Items) - 1 do
    if (OtmCatalogFind(Items[I]) < 0) then
      Result := OtmCsvAdd(Result, Items[I]);
  Target := OtmWithDependencies(Components);
  Change := '';
  for I := 0 to GetArrayLength(OtmCatalog) - 1 do
    if not OtmCatalog[I].IsCategory then
    begin
      if OtmCsvHas(Target, OtmCatalog[I].Name) then
        Change := OtmCsvAdd(Change, OtmCatalog[I].Name)
      else
        Change := OtmCsvAdd(Change, '!' + OtmCatalog[I].Name);
    end;
  WizardSelectComponents(Change);
  OtmPrevSelection := WizardSelectedComponents(False);
end;

procedure OtmSaveProfile(Sender: TObject);
var
  FileName: String;
begin
  ForceDirectories(OtmProfilesDir);
  FileName := OtmProfilesDir + '\' + CustomMessage('OtmProfileDefaultName') + '.ini';
  if not GetSaveFileName(CustomMessage('OtmProfileSaveTitle'), FileName, OtmProfilesDir, CustomMessage('OtmProfileFilter'), 'ini') then
    Exit;
  OtmNewIni(FileName);
  SetIniString(OtmProfileSection, 'SetupType', 'custom', FileName);
  SetIniString(OtmProfileSection, 'Components', WizardSelectedComponents(False), FileName);
  SetIniString('Otmetki', 'modpack', '{#OtmModpackVersion}', FileName);
  SetIniString('Otmetki', 'saved', GetDateTimeString('yyyy-mm-dd hh:nn', '-', ':'), FileName);
  MsgBox(FmtMessage(CustomMessage('OtmProfileSaved'), [FileName]), mbInformation, MB_OK);
end;

procedure OtmLoadProfile(Sender: TObject);
var
  FileName, Unknown: String;
begin
  FileName := '';
  if not GetOpenFileName(CustomMessage('OtmProfileLoadTitle'), FileName, OtmProfilesDir, CustomMessage('OtmProfileFilter'), 'ini') then
    Exit;
  if not IniKeyExists(OtmProfileSection, 'Components', FileName) then
  begin
    MsgBox(CustomMessage('OtmProfileInvalid'), mbError, MB_OK);
    Exit;
  end;
  OtmSelectCustomType;
  Unknown := OtmApplySelection(GetIniString(OtmProfileSection, 'Components', '', FileName));
  if Unknown <> '' then
    MsgBox(FmtMessage(CustomMessage('OtmProfileUnknown'), [Unknown]), mbInformation, MB_OK);
end;
