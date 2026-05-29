describe('POST /loans/:loanId/build-cancel', () => {
  it('should build cancel transaction', async () => {
    const response = await request(app)
      .post(
        '/loans/loan-123/build-cancel',
      )
      .set(
        'Authorization',
        `Bearer ${token}`,
      );

    expect(response.status).toBe(200);

    expect(
      response.body.transaction,
    ).toBeDefined();
  });
});


describe(
  'POST /admin/loans/:loanId/build-reject',
  () => {
    it(
      'should build reject transaction',
      async () => {
        const response = await request(app)
          .post(
            '/admin/loans/loan-123/build-reject',
          )
          .set(
            'Authorization',
            `Bearer ${adminToken}`,
          )
          .send({
            reason:
              'Insufficient collateral',
          });

        expect(
          response.status,
        ).toBe(200);
      },
    );
  },
);

it(
  'should reject non-cancellable loans',
  async () => {
    const response = await request(app)
      .post(
        '/loans/completed-loan/build-cancel',
      )
      .set(
        'Authorization',
        `Bearer ${token}`,
      );

    expect(response.status).toBe(400);
  },
);

it(
  'should fail if reason too short',
  async () => {
    const response = await request(app)
      .post(
        '/admin/loans/loan-1/build-reject',
      )
      .set(
        'Authorization',
        `Bearer ${adminToken}`,
      )
      .send({
        reason: 'bad',
      });

    expect(response.status).toBe(400);
  },
);