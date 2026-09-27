import type { RefreshingAuthProviderConfig } from '@twurple/auth';
import type { ChatClientOptions } from '@twurple/chat';

import { Injectable } from '@nestjs/common';
import { ApiClient } from '@twurple/api';
import { exchangeCode, getAppToken, getTokenInfo, RefreshingAuthProvider } from '@twurple/auth';
import { ChatClient } from '@twurple/chat';

@Injectable()
export class TwitchSdkService {
  readonly getAppToken = getAppToken;
  readonly exchangeCode = exchangeCode;
  readonly getTokenInfo = getTokenInfo;

  createAuthProvider(config: RefreshingAuthProviderConfig): RefreshingAuthProvider {
    return new RefreshingAuthProvider(config);
  }

  createChatClient(options: ChatClientOptions): ChatClient {
    return new ChatClient(options);
  }

  createApiClient(authProvider: RefreshingAuthProvider): ApiClient {
    return new ApiClient({ authProvider });
  }
}
