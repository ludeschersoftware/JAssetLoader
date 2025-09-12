class MockAudioContext {
    decodeAudioData = jest.fn((buffer: ArrayBuffer) =>
        Promise.resolve({ decoded: buffer })
    );
}

(global as any).AudioContext = MockAudioContext;
