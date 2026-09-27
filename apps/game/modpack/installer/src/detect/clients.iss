[Code]
{ Game clients through OpenWG.Utils: it reads Lesta Game Center (lgc_path.dat -> preferences.xml), checks
  app_type.xml / version.xml / paths.xml / Tanki.exe and returns the mods and res_mods paths from paths.xml.
  This unit adds what the modpack needs on top: only «Мир танков» 1.35+ (the .mtmod clients), absolute paths,
  and labels. No wizard access here: tests/units/harness.iss runs it against fixture clients. }

const
  OtmVendorLesta = 2;
  OtmBranchRelease = 1;
  OtmBranchCommonTest = 2;
  OtmLauncherLgc = 4;
  OtmMinMinorVersion = 35;

type
  TOtmClient = record
    Index: Integer;
    Path: String;
    Version: String;
    Branch: Integer;
    ModsDir: String;
    ResModsDir: String;
    Problem: String;
  end;
  TOtmClientList = array of TOtmClient;

{ The numeric part at Index of a dotted version ('1.45.0.0', 1 -> 45); -1 when missing. }
function OtmVersionPart(const Version: String; Index: Integer): Integer;
var
  Parts: TArrayOfString;
begin
  Result := -1;
  Parts := StringSplit(Trim(Version), ['.'], stAll);
  if Index < GetArrayLength(Parts) then
    Result := StrToIntDef(Trim(Parts[Index]), -1);
end;

{ «Мир танков» loads .mtmod packages from 1.35 on. }
function OtmIsSupportedVersion(const Version: String): Boolean;
begin
  Result := (OtmVersionPart(Version, 0) = 1) and (OtmVersionPart(Version, 1) >= OtmMinMinorVersion);
end;

{ Root + a paths.xml path such as './mods/1.45.0.0'; Fallback when paths.xml had none. }
function OtmClientPath(const Root, Relative, Fallback: String): String;
var
  Value: String;
begin
  Value := Trim(Relative);
  if Value = '' then
    Value := Fallback;
  StringChangeEx(Value, '/', '\', True);
  while Copy(Value, 1, 2) = '.\' do
    Delete(Value, 1, 2);
  Result := RemoveBackslashUnlessRoot(PathNormalizeSlashes(PathCombine(Root, Value)));
end;

{ '' when the client is supported, otherwise the custom message that explains why not. }
function OtmClientProblem(Vendor: Integer; const Version: String): String;
begin
  Result := '';
  if Vendor <> OtmVendorLesta then
    Result := 'OtmClientNotLesta'
  else if not OtmIsSupportedVersion(Version) then
    Result := 'OtmClientOldVersion';
end;

function OtmClientFromIndex(Index: Integer): TOtmClient;
var
  Rec: ClientRecord;
begin
  Rec := CLIENT_GetRecord(Index);
  Result.Index := Index;
  Result.Path := RemoveBackslashUnlessRoot(Rec.Path);
  Result.Version := Rec.Version;
  Result.Branch := Rec.Branch;
  Result.ModsDir := OtmClientPath(Result.Path, Rec.PathMods, 'mods\' + Rec.Version);
  Result.ResModsDir := OtmClientPath(Result.Path, Rec.PathResmods, 'res_mods\' + Rec.Version);
  Result.Problem := OtmClientProblem(Rec.Vendor, Rec.Version);
  Log(Format('Client #%d %s: vendor %d, version %s, branch %d, mods %s, res_mods %s, problem "%s"', [
    Index, Result.Path, Rec.Vendor, Result.Version, Result.Branch, Result.ModsDir, Result.ResModsDir, Result.Problem]));
end;

{ Clients registered in Lesta Game Center (release and common test). }
function OtmDetectClients: TOtmClientList;
var
  I, Count: Integer;
  Client: TOtmClient;
begin
  SetArrayLength(Result, 0);
  WOT_LauncherSetDefault(OtmVendorLesta, OtmVendorLesta);
  WOT_Discovery_SetBranchFilter(OtmBranchRelease or OtmBranchCommonTest);
  for I := 0 to WOT_GetClientsCount() - 1 do
  begin
    Client := OtmClientFromIndex(I);
    Count := GetArrayLength(Result);
    SetArrayLength(Result, Count + 1);
    Result[Count] := Client;
  end;
end;

{ A client folder the player picked by hand; False when OpenWG sees no game client there. }
function OtmAddClient(const Dir: String; var Client: TOtmClient): Boolean;
var
  Index: Integer;
begin
  Index := WOT_AddClientW(RemoveBackslashUnlessRoot(Dir));
  Result := Index >= 0;
  if Result then
    Client := OtmClientFromIndex(Index)
  else
    Log('No game client in ' + Dir);
end;

function OtmPreferredClientPath: String;
var
  Index: Integer;
begin
  Result := '';
  Index := WOT_LauncherGetPreferredClient(OtmLauncherLgc);
  if Index >= 0 then
    Result := RemoveBackslashUnlessRoot(WOT_GetClientPathW(Index));
end;

function OtmClientRunning(const Client: TOtmClient): Boolean;
begin
  Result := (Client.Index >= 0) and WOT_ClientIsStarted(Client.Index);
end;

function OtmBranchName(Branch: Integer): String;
begin
  if Branch = OtmBranchCommonTest then
    Result := CustomMessage('OtmBranchCommonTest')
  else
    Result := CustomMessage('OtmBranchRelease');
end;

function OtmClientLabel(const Client: TOtmClient): String;
begin
  Result := FmtMessage(CustomMessage('OtmClientLabel'), [Client.Version, OtmBranchName(Client.Branch), Client.Path]);
end;

function OtmClientProblemText(const Client: TOtmClient): String;
begin
  Result := FmtMessage(CustomMessage(Client.Problem), [Client.Version, Client.Path]);
end;
