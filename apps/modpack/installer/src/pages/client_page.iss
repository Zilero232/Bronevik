[Code]
{ «Game client» page, right after Welcome: every supported client OpenWG found (main and common test),
  preselected as last time, else the one Lesta Game Center prefers, plus «Browse...» for a client the
  launcher does not know. Silent installs take /GAMEDIR="<client folder>" or the preselected client. }

var
  OtmClientPage: TInputOptionWizardPage;
  OtmClientBrowseButton: TNewButton;
  OtmClientNoneLabel: TNewStaticText;
  OtmClients: TOtmClientList;
  OtmClient: TOtmClient;
  OtmHasClient: Boolean;

function OtmModsDir(Param: String): String;
begin
  Result := OtmClient.ModsDir;
end;

function OtmFindClient(const Path: String): Integer;
var
  I: Integer;
begin
  Result := -1;
  for I := 0 to GetArrayLength(OtmClients) - 1 do
    if PathSame(OtmClients[I].Path, RemoveBackslashUnlessRoot(Path)) then
    begin
      Result := I;
      Exit;
    end;
end;

procedure OtmFillClientList(const SelectPath: String);
var
  I, Row: Integer;
begin
  OtmClientPage.CheckListBox.Items.Clear;
  Row := 0;
  for I := 0 to GetArrayLength(OtmClients) - 1 do
  begin
    OtmClientPage.Add(OtmClientLabel(OtmClients[I]));
    if PathSame(OtmClients[I].Path, SelectPath) then
      Row := I;
  end;
  if GetArrayLength(OtmClients) > 0 then
    OtmClientPage.SelectedValueIndex := Row;
  OtmClientNoneLabel.Visible := GetArrayLength(OtmClients) = 0;
end;

{ Adds a supported client to the list; returns its index or -1 (Problem explains why it was not added). }
function OtmRememberClient(const Client: TOtmClient): Integer;
begin
  Result := OtmFindClient(Client.Path);
  if (Result < 0) and (Client.Problem = '') then
  begin
    Result := GetArrayLength(OtmClients);
    SetArrayLength(OtmClients, Result + 1);
    OtmClients[Result] := Client;
  end;
end;

procedure OtmBrowseClient(Sender: TObject);
var
  Dir: String;
  Client: TOtmClient;
begin
  Dir := '';
  if not BrowseForFolder(CustomMessage('OtmClientBrowsePrompt'), Dir, False) then
    Exit;
  if not OtmAddClient(Dir, Client) then
    MsgBox(CustomMessage('OtmClientNotFound'), mbError, MB_OK)
  else if Client.Problem <> '' then
    MsgBox(OtmClientProblemText(Client), mbError, MB_OK)
  else
  begin
    OtmRememberClient(Client);
    OtmFillClientList(Client.Path);
  end;
end;

function OtmInitialClientPath: String;
begin
  Result := ExpandConstant('{param:GAMEDIR|}');
  if Result = '' then
    Result := GetPreviousData('Client', '');
  if (Result = '') or (OtmFindClient(Result) < 0) then
    Result := OtmPreferredClientPath;
  if (OtmFindClient(Result) < 0) and (GetArrayLength(OtmClients) > 0) then
    Result := OtmClients[0].Path;
end;

procedure OtmClientPageInit(AfterID: Integer);
var
  Detected: TOtmClientList;
  Client: TOtmClient;
  I: Integer;
  GameDir: String;
begin
  OtmClientPage := CreateInputOptionPage(AfterID, CustomMessage('OtmClientPageCaption'), CustomMessage('OtmClientPageDescription'),
    CustomMessage('OtmClientPageSubCaption'), True, True);
  OtmClientPage.CheckListBox.Height := OtmClientPage.SurfaceHeight - ScaleY(70);

  OtmClientBrowseButton := TNewButton.Create(OtmClientPage);
  OtmClientBrowseButton.Parent := OtmClientPage.Surface;
  OtmClientBrowseButton.Caption := CustomMessage('OtmClientBrowse');
  OtmClientBrowseButton.Left := 0;
  OtmClientBrowseButton.Top := OtmClientPage.CheckListBox.Top + OtmClientPage.CheckListBox.Height + ScaleY(8);
  OtmClientBrowseButton.Width := ScaleX(160);
  OtmClientBrowseButton.Height := ScaleY(25);
  OtmClientBrowseButton.OnClick := @OtmBrowseClient;

  OtmClientNoneLabel := TNewStaticText.Create(OtmClientPage);
  OtmClientNoneLabel.Parent := OtmClientPage.Surface;
  OtmClientNoneLabel.Caption := CustomMessage('OtmClientNone');
  OtmClientNoneLabel.WordWrap := True;
  OtmClientNoneLabel.AutoSize := False;
  OtmClientNoneLabel.Left := OtmClientPage.CheckListBox.Left + ScaleX(8);
  OtmClientNoneLabel.Top := OtmClientPage.CheckListBox.Top + ScaleY(8);
  OtmClientNoneLabel.Width := OtmClientPage.CheckListBox.Width - ScaleX(16);
  OtmClientNoneLabel.AdjustHeight;

  SetArrayLength(OtmClients, 0);
  Detected := OtmDetectClients;
  for I := 0 to GetArrayLength(Detected) - 1 do
    OtmRememberClient(Detected[I]);
  GameDir := ExpandConstant('{param:GAMEDIR|}');
  if (GameDir <> '') and (OtmFindClient(GameDir) < 0) and OtmAddClient(GameDir, Client) then
    OtmRememberClient(Client);
  OtmFillClientList(OtmInitialClientPath);
end;

function OtmClientPageNext: Boolean;
var
  Row: Integer;
begin
  Row := OtmClientPage.SelectedValueIndex;
  Result := (Row >= 0) and (Row < GetArrayLength(OtmClients));
  if not Result then
  begin
    SuppressibleMsgBox(CustomMessage('OtmClientChoose'), mbError, MB_OK, IDOK);
    Exit;
  end;
  OtmClient := OtmClients[Row];
  OtmHasClient := True;
  Log('Selected client ' + OtmClient.Path);
end;

procedure OtmRegisterClientData(PreviousDataKey: Integer);
begin
  if OtmHasClient then
    SetPreviousData(PreviousDataKey, 'Client', OtmClient.Path);
end;
