// Health One — Placeholder screens S1–S3 (DEV-017 to DEV-019).

export function CustomerSearchScreen() {
  return (
    <div data-testid="screen-s1">
      <h1 className="text-2xl font-bold mb-4">Customer Search / Create</h1>
      <p className="text-gray-500 mb-4">
        Search for existing customers or create new ones.
      </p>
      <div className="bg-white rounded-lg border p-8 text-center text-gray-400">
        [ S1: Customer Search — DEV-017 ]
      </div>
    </div>
  );
}

export function CustomerSummaryScreen() {
  return (
    <div data-testid="screen-s2">
      <h1 className="text-2xl font-bold mb-4">
        Customer 健康元 Summary
      </h1>
      <div className="bg-white rounded-lg border p-8 text-center text-gray-400">
        [ S2: Customer Summary — DEV-018 ]
      </div>
    </div>
  );
}

export function ConcernIntakeScreen() {
  return (
    <div data-testid="screen-s3">
      <h1 className="text-2xl font-bold mb-4">Health Concern Intake</h1>
      <div className="bg-white rounded-lg border p-8 text-center text-gray-400">
        [ S3: Concern Intake — DEV-019 ]
      </div>
    </div>
  );
}
