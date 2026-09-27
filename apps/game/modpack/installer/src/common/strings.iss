[Code]
{ Comma-separated name sets, the format WizardSelectedComponents and /LOADINF use. Case-insensitive. }

function OtmCsvHas(const Csv, Name: String): Boolean;
begin
  Result := (Name <> '') and (Pos(',' + Lowercase(Name) + ',', ',' + Lowercase(Csv) + ',') > 0);
end;

function OtmCsvAdd(const Csv, Name: String): String;
begin
  if (Name = '') or OtmCsvHas(Csv, Name) then
    Result := Csv
  else if Csv = '' then
    Result := Name
  else
    Result := Csv + ',' + Name;
end;

function OtmCsvItems(const Csv: String): TArrayOfString;
begin
  if Trim(Csv) = '' then
    SetArrayLength(Result, 0)
  else
    Result := StringSplit(Csv, [','], stExcludeEmpty);
end;

{ Csv minus the names in Removed. }
function OtmCsvRemove(const Csv, Removed: String): String;
var
  Items: TArrayOfString;
  I: Integer;
begin
  Result := '';
  Items := OtmCsvItems(Csv);
  for I := 0 to GetArrayLength(Items) - 1 do
    if not OtmCsvHas(Removed, Items[I]) then
      Result := OtmCsvAdd(Result, Items[I]);
end;

function OtmCsvSame(const A, B: String): Boolean;
begin
  Result := (OtmCsvRemove(A, B) = '') and (OtmCsvRemove(B, A) = '');
end;

procedure OtmAppend(var Items: TArrayOfString; const Value: String);
var
  Count: Integer;
begin
  Count := GetArrayLength(Items);
  SetArrayLength(Items, Count + 1);
  Items[Count] := Value;
end;

{ A file name against ';'-separated masks, e.g. the OtmOwnedPatterns define. }
function OtmMatchesAny(const FileName, Masks: String): Boolean;
var
  Items: TArrayOfString;
  I: Integer;
begin
  Result := False;
  Items := StringSplit(Masks, [';'], stExcludeEmpty);
  for I := 0 to GetArrayLength(Items) - 1 do
    if WildcardMatch(Lowercase(FileName), Lowercase(Trim(Items[I]))) then
    begin
      Result := True;
      Exit;
    end;
end;
