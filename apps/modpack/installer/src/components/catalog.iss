[Code]
{ The component table. OtmCatalogInit (generated into components.iss by tools/build/setupkit) fills it in
  the [Components] order: a category row, then its components. Names are Inno component names
  ("battle\marks_panel"); Depends lists component names, comma-separated. }

type
  TOtmCatalogItem = record
    Name: String;
    Id: String;
    IsCategory: Boolean;
    Required: Boolean;
    FileName: String;
    Preview: String;
    Video: String;
    Depends: String;
  end;

var
  OtmCatalog: array of TOtmCatalogItem;
  { The selection the components page last saw; its click handler diffs against it. }
  OtmPrevSelection: String;

procedure OtmCatalogAdd(const Name, Id: String; IsCategory, Required: Boolean; const FileName, Preview, Video, Depends: String);
var
  Count: Integer;
begin
  Count := GetArrayLength(OtmCatalog);
  SetArrayLength(OtmCatalog, Count + 1);
  OtmCatalog[Count].Name := Name;
  OtmCatalog[Count].Id := Id;
  OtmCatalog[Count].IsCategory := IsCategory;
  OtmCatalog[Count].Required := Required;
  OtmCatalog[Count].FileName := FileName;
  OtmCatalog[Count].Preview := Preview;
  OtmCatalog[Count].Video := Video;
  OtmCatalog[Count].Depends := Depends;
end;

{ Accepts both separators: OpenWG's INNO_ChecklistGetItemName returns "battle/marks_panel". }
function OtmCatalogFind(const Name: String): Integer;
var
  I: Integer;
  Wanted: String;
begin
  Result := -1;
  Wanted := Name;
  StringChangeEx(Wanted, '/', '\', True);
  for I := 0 to GetArrayLength(OtmCatalog) - 1 do
    if SameText(OtmCatalog[I].Name, Wanted) then
    begin
      Result := I;
      Exit;
    end;
end;

{ Every installable (non-category) component name. }
function OtmCatalogComponents: String;
var
  I: Integer;
begin
  Result := '';
  for I := 0 to GetArrayLength(OtmCatalog) - 1 do
    if not OtmCatalog[I].IsCategory then
      Result := OtmCsvAdd(Result, OtmCatalog[I].Name);
end;

{ The installable (non-category) names in Csv. }
function OtmInstallable(const Csv: String): String;
var
  I: Integer;
begin
  Result := '';
  for I := 0 to GetArrayLength(OtmCatalog) - 1 do
    if (not OtmCatalog[I].IsCategory) and OtmCsvHas(Csv, OtmCatalog[I].Name) then
      Result := OtmCsvAdd(Result, OtmCatalog[I].Name);
end;

{ Selected plus everything it depends on, transitively. Categories and unknown names are dropped. }
function OtmWithDependencies(const Selected: String): String;
var
  I, J: Integer;
  Changed: Boolean;
  Depends: TArrayOfString;
begin
  Result := '';
  for I := 0 to GetArrayLength(OtmCatalog) - 1 do
    if (not OtmCatalog[I].IsCategory) and (OtmCatalog[I].Required or OtmCsvHas(Selected, OtmCatalog[I].Name)) then
      Result := OtmCsvAdd(Result, OtmCatalog[I].Name);
  repeat
    Changed := False;
    for I := 0 to GetArrayLength(OtmCatalog) - 1 do
      if OtmCsvHas(Result, OtmCatalog[I].Name) then
      begin
        Depends := OtmCsvItems(OtmCatalog[I].Depends);
        for J := 0 to GetArrayLength(Depends) - 1 do
          if not OtmCsvHas(Result, Depends[J]) then
          begin
            Result := OtmCsvAdd(Result, Depends[J]);
            Changed := True;
          end;
      end;
  until not Changed;
end;

{ Selected minus Removed and minus whatever depends on a removed component, transitively.
  Required components are never removed. }
function OtmWithoutDependents(const Selected, Removed: String): String;
var
  I, J: Integer;
  Changed: Boolean;
  Gone: String;
  Depends: TArrayOfString;
begin
  Gone := '';
  for I := 0 to GetArrayLength(OtmCatalog) - 1 do
    if OtmCsvHas(Removed, OtmCatalog[I].Name) and not OtmCatalog[I].Required then
      Gone := OtmCsvAdd(Gone, OtmCatalog[I].Name);
  repeat
    Changed := False;
    for I := 0 to GetArrayLength(OtmCatalog) - 1 do
      if OtmCsvHas(Selected, OtmCatalog[I].Name) and not OtmCsvHas(Gone, OtmCatalog[I].Name) and not OtmCatalog[I].Required then
      begin
        Depends := OtmCsvItems(OtmCatalog[I].Depends);
        for J := 0 to GetArrayLength(Depends) - 1 do
          if OtmCsvHas(Gone, Depends[J]) then
          begin
            Gone := OtmCsvAdd(Gone, OtmCatalog[I].Name);
            Changed := True;
            Break;
          end;
      end;
  until not Changed;
  Result := OtmCsvRemove(OtmWithDependencies(OtmCsvRemove(Selected, Gone)), Gone);
end;

{ The package files of the selected components. }
function OtmCatalogFiles(const Selected: String): TArrayOfString;
var
  I: Integer;
begin
  SetArrayLength(Result, 0);
  for I := 0 to GetArrayLength(OtmCatalog) - 1 do
    if (not OtmCatalog[I].IsCategory) and OtmCsvHas(Selected, OtmCatalog[I].Name) then
      OtmAppend(Result, OtmCatalog[I].FileName);
end;
