export const verifyEmailTemplate = `<mjml>
<mj-head>
  <mj-title>Discount Light</mj-title>
  <mj-preview>Pre-header Text</mj-preview>
  <mj-attributes>
    <mj-all font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"></mj-all>
    <mj-text font-weight="400" font-size="16px" color="#000000" line-height="24px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"></mj-text>
  </mj-attributes>
  <mj-style inline="inline">
    .body-section { -webkit-box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15); -moz-box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15); box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15); }
  </mj-style>
  <mj-style inline="inline">
    .text-link { color: #5e6ebf }
  </mj-style>
  <mj-style inline="inline">
    .footer-link { color: #888888 }
  </mj-style>

</mj-head>
<mj-body background-color="#E7E7E7" width="600px">
  <mj-section full-width="full-width" background-color="#E7E7E7" padding-bottom="0" padding-top="0">
    <mj-column width="100%">
      <mj-image src="https://malcoded.com/email/malcoded-logo.png" alt="" align="center" width="150px" />


      <mj-image src="https://malcoded.com/email/malcoded-email-header.png" width="600px" alt="" padding="0" href="https://google.com" />
    </mj-column>

  </mj-section>



  <mj-wrapper padding-top="0" padding-bottom="0" css-class="body-section">
    <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
      <mj-column width="100%">
        <mj-text color="#212b35" font-weight="bold" font-size="20px">
          Confirm your free newsletter subscription
        </mj-text>
        <mj-text color="#637381" font-size="16px">
          Hi there,
        </mj-text>
        <mj-text color="#637381" font-size="16px">
          This email address was just used to request our free newsletter on malcoded.com. If you did not submit this request, please ignore this email and we apologize for disturbing you.
        </mj-text>
        <mj-text color="#637381" font-size="16px">
          If you would like to receive our newsletter with information on web-application development, our products and special offers by email, please confirm your request by clicking on the link below. We will then add you to our newsletter mailing list.
        </mj-text>


        <mj-text color="#637381" font-size="16px">
          By clicking below, you confirm your registration to our free newsletter:
        </mj-text>

        <mj-button background-color="#9A68F2" align="center" color="#fff" font-size="17px" font-weight="bold" width="300px" padding-top="32px" padding-bottom="32px" href="[[verifyEmailLink]]">
          Subscribe to the newsletter
        </mj-button>
        <mj-text color="#637381" font-size="16px">
          You can unsubscribe at any time in the future from our newsletter, by clicking on the unsubscribe link included in every newsletter.
        </mj-text>

      </mj-column>

    </mj-section>

  </mj-wrapper>
  <mj-section padding-top="32px">
    <mj-group>
      <mj-column width="100%" padding-right="0">
        <mj-text color="#445566" font-size="11px" align="center" line-height="16px" font-weight="bold">
          <a class="footer-link" href="https://malcoded.com/privacy">Privacy</a>&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;<a class="footer-link" href="https://malcoded.com/legal">Legal Notice</a>
        </mj-text>
      </mj-column>
    </mj-group>

  </mj-section>

</mj-body>
</mjml>`;
