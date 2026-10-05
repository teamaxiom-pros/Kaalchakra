export interface PhysicalGameAction {
  type: 'token_placed' | 'token_scanned' | 'board_rotated';
  tokenId: string;
  tokenName: string;
  metadata: Record<string, unknown>;
  timestamp: string;
}

export interface PhysicalInteractionProvider {
  connect(): Promise<boolean>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  receiveAction(): Promise<PhysicalGameAction>;
}

export class SimulatedSmartBoardProvider implements PhysicalInteractionProvider {
  private connected: boolean = false;
  private actionQueue: PhysicalGameAction[] = [];

  async connect(): Promise<boolean> {
    this.connected = true;
    return true;
  }

  async disconnect(): Promise<void> {
    this.connected = false;
  }

  isConnected(): boolean {
    return this.connected;
  }

  simulateTokenPlacement(tokenId: string, tokenName: string, metadata: Record<string, unknown> = {}): void {
    if (!this.connected) return;
    this.actionQueue.push({
      type: 'token_placed',
      tokenId,
      tokenName,
      metadata,
      timestamp: new Date().toISOString(),
    });
  }

  async receiveAction(): Promise<PhysicalGameAction> {
    if (this.actionQueue.length > 0) {
      return this.actionQueue.shift()!;
    }
    return new Promise(resolve => {
      const check = setInterval(() => {
        if (this.actionQueue.length > 0) {
          clearInterval(check);
          resolve(this.actionQueue.shift()!);
        }
      }, 200);
    });
  }
}

export const smartBoardSim = new SimulatedSmartBoardProvider();
