# Two-factor authentication

Cozy's home now comes with a configuration panel for the two-factor authentication, already supported in the authentication proxy ([more infos](https://github.com/cozy/cozy-proxy/blob/master/doc/2fa.md)).

The panel is located below the password one in the Setting page, and looks like this when 2FA isn't enabled:

![capture d ecran de 2016-04-15 20-36-58](https://cloud.githubusercontent.com/assets/5547783/14571515/ed669f5a-0349-11e6-9b95-9cb8ff43325f.png)

The user selects the authentication strategy (algorithm) of its choice between the available ones (only HOTP and TOTP for now), then clicks the button. The server will then edit the current user in the DS: it will generate an OTP key (random string) and will fill the auth type accordingly ("hotp" or "totp").

Once the user has clicked the button, the page will display a success message and reload after 2s. The Settings page now displays this as the 2FA panel:

![capture d ecran de 2016-04-15 20-46-45](https://cloud.githubusercontent.com/assets/5547783/14571793/73d72df6-034b-11e6-94da-4e1ac57783f1.png)

When the home loads, it checks wether 2FA is enabled to know which panel it has to display. It also retrieve the 2FA token the user will have to enter into its app or device, in order to display it and generate matching QR Code.

## HOTP specificity

The configuration panel for HOTP is a bit different. Indeed, there's an issue we can have with the fact that we store the highest counter encountered until now in order to invalidate any previously used authentication code: when the user switches from authentication app or device to another, its generation will start all the way back to the very first code, with counter 0 (because the new app or device has no way to know the counter we have in the DS nor the corresponding code), which means that, if an user used more than a thousand codes on the old app/device, it'll have to generate as much codes to be able to log back into Cozy.

To address that matter, there's a button that only shows when HOTP is enabled, which resets the HOTP counter:

![capture d ecran de 2016-04-15 20-53-08](https://cloud.githubusercontent.com/assets/5547783/14572489/63955090-034f-11e6-94f6-6ed9a22efca1.png)

We can also see in the last two screenshots that the OTP key is regenerated each time we disable/enable back 2FA.