export const verifyEmailTemplate = `<mjml>
  <mj-body>
    <mj-section>
      <mj-column>

        <mj-image width="500px" src="https://malcoded.com/malcoded.svg"></mj-image>

        <mj-text color="#5B5B5B" font-size="20px" font-family="helvetica">
          Dear user,
        </mj-text>

        <mj-text color="#5B5B5B" font-size="20px" font-family="helvetica">

          This email address was just used to request our newsletter on https://malcoded.com. If you did not submit this request, please ignore this email and we apologize for disturbing you.
        </mj-text>

        <mj-text color="#5B5B5B" font-size="20px" font-family="helvetica">
          If you would like to receive our newsletter with information on web-application development by email, please confirm your request by clicking on the link below. We will then add you to our newsletter mailing list. You can unsubscribe at any time in the
          future from our newsletter, by clicking on the unsubscribe link included in every newsletter.
        </mj-text>

        <mj-text color="#5B5B5B" font-size="20px" font-family="helvetica">
          By clicking below, you confirm your registration for our newsletter:
        </mj-text>
        <mj-button align="left" font-size="22px" font-weight="bold" background-color="#c40030" border-radius="25px" color="#fff" font-family="helvetica" href="[[verifyEmailLink]]">
          Subscribe to the newsletter
        </mj-button>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;
