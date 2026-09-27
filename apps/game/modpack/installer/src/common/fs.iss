[Code]
{ File system helpers on top of Inno built-ins and the tools every Windows 10+ ships (robocopy, tar). }

const
  OtmRobocopyFirstError = 8;

{ Makes Target an exact copy of Source (robocopy /MIR). Exit codes below 8 mean success. }
function OtmMirror(const Source, Target: String): Boolean;
var
  ResultCode: Integer;
begin
  Result := Exec(ExpandConstant('{sys}\robocopy.exe'),
    AddQuotes(RemoveBackslashUnlessRoot(Source)) + ' ' + AddQuotes(RemoveBackslashUnlessRoot(Target)) +
    ' /MIR /COPY:DAT /DCOPY:T /R:1 /W:1 /XJ /NFL /NDL /NJH /NJS /NP',
    '', SW_HIDE, ewWaitUntilTerminated, ResultCode) and (ResultCode < OtmRobocopyFirstError);
  Log(Format('Mirror %s -> %s: exit %d', [Source, Target, ResultCode]));
end;

{ Names of the files and folders directly inside Dir. }
function OtmListEntries(const Dir: String): TArrayOfString;
var
  FindRec: TFindRec;
begin
  SetArrayLength(Result, 0);
  if (Trim(Dir) = '') or not DirExists(Dir) then
    Exit;
  if FindFirst(AddBackslash(Dir) + '*', FindRec) then
  try
    repeat
      if (FindRec.Name <> '.') and (FindRec.Name <> '..') then
        OtmAppend(Result, FindRec.Name);
    until not FindNext(FindRec);
  finally
    FindClose(FindRec);
  end;
end;

{ Deletes a file or a whole folder. Refuses drive roots and relative paths. }
function OtmDeleteEntry(const Path: String): Boolean;
begin
  Result := False;
  if not PathIsRooted(Path) or (Length(RemoveBackslashUnlessRoot(Path)) <= 3) then
  begin
    Log('Refusing to delete ' + Path);
    Exit;
  end;
  if DirExists(Path) then
    Result := DelTree(Path, True, True, True)
  else
    Result := DeleteFile(Path);
  Log(Format('Delete %s: %d', [Path, Ord(Result)]));
end;

{ Copies File into Dir when it exists; for the logs bundle. }
procedure OtmCopyIfExists(const FileName, Dir: String);
begin
  if FileExists(FileName) then
    CopyFile(FileName, AddBackslash(Dir) + ExtractFileName(FileName), False);
end;

{ Zips the contents of Dir into ZipFile with the tar.exe of Windows 10 1803+. }
function OtmZipFolder(const Dir, ZipFile: String): Boolean;
var
  ResultCode: Integer;
begin
  Result := Exec(ExpandConstant('{sys}\tar.exe'),
    '-a -c -f ' + AddQuotes(ZipFile) + ' -C ' + AddQuotes(RemoveBackslashUnlessRoot(Dir)) + ' .',
    '', SW_HIDE, ewWaitUntilTerminated, ResultCode) and (ResultCode = 0) and FileExists(ZipFile);
  Log(Format('Zip %s -> %s: exit %d', [Dir, ZipFile, ResultCode]));
end;
