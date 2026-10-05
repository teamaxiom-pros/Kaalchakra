import React, { useState } from 'react';
import { Cpu, X, Radio, CheckCircle, Info } from 'lucide-react';
import { smartBoardSim } from '../../domain/hardware/physicalProvider';

interface SmartBoardSimModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulateToken?: (tokenId: string, tokenName: string) => void;
}

export const SmartBoardSimModal: React.FC<SmartBoardSimModalProps> = ({
  isOpen,
  onClose,
  onSimulateToken,
}) => {
  const [connected, setConnected] = useState(smartBoardSim.isConnected());
  const [log, setLog] = useState<string[]>([]);

  if (!isOpen) return null;

  const toggleConnection = async () => {
    if (connected) {
      await smartBoardSim.disconnect();
      setConnected(false);
      setLog(prev => [`[${new Date().toLocaleTimeString()}] Smart Board disconnected`, ...prev]);
    } else {
      await smartBoardSim.connect();
      setConnected(true);
      setLog(prev => [
        `[${new Date().toLocaleTimeString()}] Simulated Smart Board connected via virtual serial interface`,
        ...prev,
      ]);
    }
  };

  const handleSimulatePlacement = (tokenId: string, tokenName: string) => {
    smartBoardSim.simulateTokenPlacement(tokenId, tokenName);
    setLog(prev => [
      `[${new Date().toLocaleTimeString()}] Physical token placed: ${tokenName} (RFID tag: ${tokenId})`,
      ...prev,
    ]);
    if (onSimulateToken) {
      onSimulateToken(tokenId, tokenName);
    }
  };

  const tokens = [
    { id: 'tok-baoli', name: 'Baoli Stone Token (💧)', desc: 'Hydraulic rock-cut tank' },
    { id: 'tok-granary', name: 'Amberkhana Grain Token (🌾)', desc: 'Elevated storehouse' },
    { id: 'tok-watchtower', name: 'Burj Bastion Token (👁️)', desc: 'Surveillance watchtower' },
    { id: 'tok-gate', name: 'Maha Darwaza Token (🚪)', desc: 'Curved bastion gate' },
    { id: 'tok-seal', name: 'Steatite Stamp Seal Token (🦄)', desc: 'Harappan trade token' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{
          border: '1.5px solid var(--accent-gold)',
          padding: '2rem',
          maxWidth: '580px',
        }}
      >
        <button
          onClick={onClose}
          className="btn btn-ghost btn-sm"
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem' }}
          aria-label="Close smart board simulation modal"
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(229, 184, 66, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-gold)',
            }}
          >
            <Cpu size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>
              Smart Board: Simulation Mode
            </h3>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Hardware Interaction Layer (ESP32 / NFC / RFID Abstraction)
            </div>
          </div>
        </div>

        {/* Notice explaining simulation */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            borderLeft: '3px solid var(--accent-gold)',
            padding: '0.85rem 1rem',
            borderRadius: '0 6px 6px 0',
            fontSize: '0.82rem',
            color: 'var(--text-secondary)',
            margin: '1.25rem 0',
            display: 'flex',
            gap: '0.6rem',
          }}
        >
          <Info size={16} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Architecture Integration:</strong> Physical wooden board blocks with embedded RFID
            chips connect through an ESP32 micro-controller to dispatch normalized game events into the
            exact same game engine interface.
          </div>
        </div>

        {/* Connection Toggle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-primary)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Radio size={18} color={connected ? 'var(--accent-emerald)' : 'var(--text-muted)'} />
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                Virtual Smart Board: {connected ? 'Active' : 'Offline'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {connected ? 'Listening for token placement on 5x5 matrix' : 'Connect to test physical actions'}
              </div>
            </div>
          </div>

          <button
            onClick={toggleConnection}
            className={`btn btn-sm ${connected ? 'btn-secondary' : 'btn-gold'}`}
          >
            {connected ? 'Disconnect Sim' : 'Activate Sim'}
          </button>
        </div>

        {/* Simulated Physical Tokens */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div
            style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: '0.65rem',
            }}
          >
            Simulate Placing a Physical Toy Token on Board:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
            {tokens.map(tok => (
              <button
                key={tok.id}
                onClick={() => handleSimulatePlacement(tok.id, tok.name)}
                disabled={!connected}
                className="btn btn-secondary btn-sm"
                style={{
                  justifyContent: 'space-between',
                  opacity: connected ? 1 : 0.5,
                  cursor: connected ? 'pointer' : 'not-allowed',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 600 }}>{tok.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>— {tok.desc}</span>
                </div>
                <CheckCircle size={14} color="var(--accent-gold)" />
              </button>
            ))}
          </div>
        </div>

        {/* Simulation Log */}
        <div>
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: '0.35rem',
            }}
          >
            Simulated Event Bus Telemetry:
          </div>
          <div
            style={{
              background: '#070a0e',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.65rem',
              height: '90px',
              overflowY: 'auto',
              fontFamily: 'monospace',
              fontSize: '0.72rem',
              color: 'var(--accent-gold)',
            }}
          >
            {log.length > 0 ? (
              log.map((item, idx) => <div key={idx}>{item}</div>)
            ) : (
              <div style={{ color: 'var(--text-muted)' }}>[Sim idle] Connect virtual smart board to stream events</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
