[Code]
{ The components page: Inno's preset combo (Recommended / Minimal / Streamer / Custom) and tree on the
  left, a preview pane on the right (image, description, fair-play note, video link) and profile buttons
  under the tree. Ticking a component ticks what it needs; unticking one unticks what needs it. }

var
  OtmPreviewImage: TBitmapImage;
  OtmPreviewTitle: TNewStaticText;
  OtmPreviewText: TNewStaticText;
  OtmPreviewFair: TNewStaticText;
  OtmPreviewVideo: TNewLinkLabel;
  OtmPreviewVideoUrl: String;
  OtmInnoClickCheck: TNotifyEvent;
  OtmInnoClick: TNotifyEvent;

procedure OtmOpenVideo(Sender: TObject; const Link: String; LinkType: TSysLinkType);
var
  ErrorCode: Integer;
begin
  if OtmPreviewVideoUrl <> '' then
    ShellExecAsOriginalUser('open', OtmPreviewVideoUrl, '', '', SW_SHOWNORMAL, ewNoWait, ErrorCode);
end;

procedure OtmLayoutPreview;
begin
  if OtmPreviewImage.Visible then
    OtmPreviewTitle.Top := OtmPreviewImage.Top + OtmPreviewImage.Height + ScaleY(10)
  else
    OtmPreviewTitle.Top := OtmPreviewImage.Top;
  OtmPreviewTitle.AdjustHeight;
  OtmPreviewText.Top := OtmPreviewTitle.Top + OtmPreviewTitle.Height + ScaleY(6);
  OtmPreviewText.AdjustHeight;
  OtmPreviewFair.Top := OtmPreviewText.Top + OtmPreviewText.Height + ScaleY(8);
  OtmPreviewFair.AdjustHeight;
  OtmPreviewVideo.Top := OtmPreviewFair.Top + OtmPreviewFair.Height + ScaleY(8);
end;

procedure OtmShowPreview(Row: Integer);
var
  Index: Integer;
  Item: TOtmCatalogItem;
  Name, PreviewFile: String;
begin
  if (Row < 0) or (Row >= WizardForm.ComponentsList.Items.Count) then
    Exit;
  Name := INNO_ChecklistGetItemName(WizardForm.ComponentsList, Row);
  Index := OtmCatalogFind(Name);
  if Index < 0 then
  begin
    Log(Format('Components row %d: unknown component "%s"', [Row, Name]));
    Exit;
  end;
  Item := OtmCatalog[Index];
  if Item.IsCategory then
  begin
    OtmPreviewTitle.Caption := CustomMessage('OtmCat_' + Item.Id);
    OtmPreviewText.Caption := CustomMessage('OtmCatDesc_' + Item.Id);
    OtmPreviewFair.Caption := '';
  end
  else
  begin
    OtmPreviewTitle.Caption := CustomMessage('OtmComp_' + Item.Id);
    OtmPreviewText.Caption := CustomMessage('OtmCompDesc_' + Item.Id);
    OtmPreviewFair.Caption := FmtMessage(CustomMessage('OtmFairPlay'), [CustomMessage('OtmCompFair_' + Item.Id)]);
  end;
  OtmPreviewImage.Visible := Item.Preview <> '';
  if Item.Preview <> '' then
  begin
    PreviewFile := ExpandConstant('{tmp}\') + Item.Preview;
    if not FileExists(PreviewFile) then
      ExtractTemporaryFile(Item.Preview);
    OtmPreviewImage.PngImage.LoadFromFile(PreviewFile);
  end;
  OtmPreviewVideoUrl := Item.Video;
  OtmPreviewVideo.Visible := Item.Video <> '';
  OtmLayoutPreview;
end;

{ Applies dependencies to the difference between the last seen selection and the current one. }
procedure OtmSyncDependencies;
var
  Now, Target, Change: String;
  I: Integer;
begin
  Now := WizardSelectedComponents(False);
  Target := OtmWithDependencies(OtmWithoutDependents(Now, OtmCsvRemove(OtmPrevSelection, Now)));
  if not OtmCsvSame(OtmInstallable(Now), Target) then
  begin
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
  end;
  OtmPrevSelection := WizardSelectedComponents(False);
end;

procedure OtmComponentsClickCheck(Sender: TObject);
begin
  if OtmInnoClickCheck <> nil then
    OtmInnoClickCheck(Sender);
  OtmSyncDependencies;
  OtmShowPreview(WizardForm.ComponentsList.ItemIndex);
end;

procedure OtmComponentsClick(Sender: TObject);
begin
  if OtmInnoClick <> nil then
    OtmInnoClick(Sender);
  OtmShowPreview(WizardForm.ComponentsList.ItemIndex);
end;

procedure OtmComponentsKeyUp(Sender: TObject; var Key: Word; Shift: TShiftState);
begin
  OtmShowPreview(WizardForm.ComponentsList.ItemIndex);
end;

function OtmNewLabel(Parent: TWinControl; Left, Top, Width: Integer): TNewStaticText;
begin
  Result := TNewStaticText.Create(WizardForm);
  Result.Parent := Parent;
  Result.AutoSize := False;
  Result.WordWrap := True;
  Result.Left := Left;
  Result.Top := Top;
  Result.Width := Width;
end;

function OtmNewButton(Parent: TWinControl; const Caption: String; Left, Top, Width: Integer; OnClick: TNotifyEvent): TNewButton;
begin
  Result := TNewButton.Create(WizardForm);
  Result.Parent := Parent;
  Result.Caption := Caption;
  Result.Left := Left;
  Result.Top := Top;
  Result.Width := Width;
  Result.Height := ScaleY(25);
  Result.OnClick := OnClick;
end;

procedure OtmComponentsPageInit;
var
  List: TNewCheckListBox;
  Surface: TWinControl;
  Lift, PaneLeft, PaneWidth, ButtonsTop, ButtonWidth: Integer;
begin
  List := WizardForm.ComponentsList;
  Surface := List.Parent;
  { The preset combo takes the place of the long hint label; the tree gets the height back. }
  Lift := WizardForm.TypesCombo.Top - WizardForm.SelectComponentsLabel.Top;
  WizardForm.SelectComponentsLabel.Visible := False;
  WizardForm.TypesCombo.Top := WizardForm.TypesCombo.Top - Lift;
  List.Top := List.Top - Lift;
  List.Height := List.Height + Lift - ScaleY(33);
  PaneWidth := (Surface.ClientWidth * 44) div 100;
  List.Anchors := [akLeft, akTop, akBottom];
  List.Width := Surface.ClientWidth - PaneWidth - ScaleX(14);
  WizardForm.TypesCombo.Anchors := [akLeft, akTop];
  WizardForm.TypesCombo.Width := List.Width;
  PaneLeft := List.Left + List.Width + ScaleX(14);
  ButtonsTop := List.Top + List.Height + ScaleY(8);
  ButtonWidth := (List.Width - ScaleX(8)) div 2;

  OtmNewButton(Surface, CustomMessage('OtmProfileSave'), List.Left, ButtonsTop, ButtonWidth, @OtmSaveProfile);
  OtmNewButton(Surface, CustomMessage('OtmProfileLoad'), List.Left + ButtonWidth + ScaleX(8), ButtonsTop, ButtonWidth, @OtmLoadProfile);

  OtmPreviewImage := TBitmapImage.Create(WizardForm);
  OtmPreviewImage.Parent := Surface;
  OtmPreviewImage.Left := PaneLeft;
  OtmPreviewImage.Top := WizardForm.TypesCombo.Top;
  OtmPreviewImage.Width := PaneWidth;
  OtmPreviewImage.Height := (PaneWidth * 9) div 16;
  OtmPreviewImage.Stretch := True;

  OtmPreviewTitle := OtmNewLabel(Surface, PaneLeft, 0, PaneWidth);
  OtmPreviewTitle.Font.Style := [fsBold];
  OtmPreviewText := OtmNewLabel(Surface, PaneLeft, 0, PaneWidth);
  OtmPreviewFair := OtmNewLabel(Surface, PaneLeft, 0, PaneWidth);

  OtmPreviewVideo := TNewLinkLabel.Create(WizardForm);
  OtmPreviewVideo.Parent := Surface;
  OtmPreviewVideo.Left := PaneLeft;
  OtmPreviewVideo.Caption := CustomMessage('OtmVideo');
  OtmPreviewVideo.OnLinkClick := @OtmOpenVideo;
  OtmPreviewVideo.Visible := False;

  OtmInnoClickCheck := List.OnClickCheck;
  OtmInnoClick := List.OnClick;
  List.OnClickCheck := @OtmComponentsClickCheck;
  List.OnClick := @OtmComponentsClick;
  List.OnKeyUp := @OtmComponentsKeyUp;
end;

procedure OtmComponentsPageShow;
begin
  OtmPrevSelection := WizardSelectedComponents(False);
  if WizardForm.ComponentsList.ItemIndex < 0 then
    WizardForm.ComponentsList.ItemIndex := 0;
  OtmShowPreview(WizardForm.ComponentsList.ItemIndex);
end;

{ Next: the selection must be closed under dependencies (a profile or /LOADINF may skip some). }
function OtmComponentsPageNext: Boolean;
begin
  WizardSelectComponents(OtmWithDependencies(WizardSelectedComponents(False)));
  Result := True;
end;
