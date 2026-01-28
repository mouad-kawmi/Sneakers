import React from 'react';

const GradientPicker = ({ value, onChange }) => {
    const defaultColor1 = '#FF6B00';
    const defaultColor2 = '#FF8800';
    const defaultDeg = '135';

    let color1 = defaultColor1;
    let color2 = defaultColor2;
    let deg = defaultDeg;

    if (value && value.includes('linear-gradient')) {
        const match = value.match(/(\d+)deg,\s*(#[a-fA-F0-9]{3,6}).*?,\s*(#[a-fA-F0-9]{3,6})/i);
        if (match) {
            deg = match[1];
            color1 = match[2];
            color2 = match[3];
        }
    }

    const updateGradient = (newC1, newC2, newDeg) => {
        onChange(`linear-gradient(${newDeg}deg, ${newC1} 0%, ${newC2} 100%)`);
    };

    return (
        <div style={{ background: 'var(--bg-app)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Loun 1</label>
                    <input
                        type="color"
                        value={color1}
                        onChange={(e) => updateGradient(e.target.value, color2, deg)}
                        style={{ width: '100%', height: '30px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Loun 2</label>
                    <input
                        type="color"
                        value={color2}
                        onChange={(e) => updateGradient(color1, e.target.value, deg)}
                        style={{ width: '100%', height: '30px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    />
                </div>
                <div style={{ width: '80px' }}>
                    <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Angle (°)</label>
                    <input
                        type="number"
                        value={deg}
                        onChange={(e) => updateGradient(color1, color2, e.target.value)}
                        style={{ width: '100%', padding: '4px', borderRadius: '4px', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', color: 'var(--text-main)' }}
                    />
                </div>
            </div>
            <div style={{
                height: '40px',
                borderRadius: '8px',
                background: value,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                color: 'white',
                fontWeight: 700,
            }}>
                Aperçu (Preview)
            </div>
        </div>
    );
};

export default GradientPicker;
