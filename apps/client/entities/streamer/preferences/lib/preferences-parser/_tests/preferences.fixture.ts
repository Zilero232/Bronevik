export const SECRET = {
  login: 'player@example.test',
  token: 'tok_5f2a9c1e7b3d4a6f8e0c2b1d',
  blob: 'gAJ9cQAoWAQAAABmb3ZfcQFLX1gIAAAAdG9rZW5fX3ECWAoAAABzZWNyZXRfeHhxA3Uu'
} as const;

export const PREFERENCES_XML = `<?xml version="1.0"?>
<root>
  <loginPage>
    <login>${SECRET.login}</login>
    <token2>${SECRET.token}</token2>
    <fov>111</fov>
    <rememberPwd>true</rememberPwd>
  </loginPage>
  <devicePreferences>
    <windowMode>1</windowMode>
    <fullscreenWidth>	2560	</fullscreenWidth>
    <fullscreenHeight>	1440	</fullscreenHeight>
    <fullscreenRefresh>	165	</fullscreenRefresh>
    <windowedWidth>1280</windowedWidth>
    <windowedHeight>720</windowedHeight>
    <waitVSync>false</waitVSync>
    <tripleBuffering>true</tripleBuffering>
  </devicePreferences>
  <graphicsPreferences>
    <graphicsPreset>2</graphicsPreset>
  </graphicsPreferences>
  <scriptsPreferences>
    <fov>	95.000000	</fov>
    <enablePostMortemEffect>1</enablePostMortemEffect>
    <controlMode>
      <arcadeMode><camera><sensitivity>0.456789</sensitivity></camera></arcadeMode>
      <sniperMode><camera><sensitivity>0.32</sensitivity></camera></sniperMode>
    </controlMode>
    <someGameplaySection>${SECRET.blob}</someGameplaySection>
    <accountSettings>${SECRET.blob}</accountSettings>
  </scriptsPreferences>
</root>`;

export const INVALID_XML = `<root>
  <devicePreferences>
    <fullscreenWidth>wide</fullscreenWidth>
    <fullscreenHeight>1080</fullscreenHeight>
    <fullscreenRefresh>9999</fullscreenRefresh>
    <waitVSync>maybe</waitVSync>
    <windowMode>7</windowMode>
  </devicePreferences>
  <fov>300</fov>
  <enablePostMortemEffect>${SECRET.blob}</enablePostMortemEffect>
</root>`;
