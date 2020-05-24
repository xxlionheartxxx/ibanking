const crypto = require('crypto');

function verifyRSASign(rawPublicKey, signature, rawMessage) {
    const publicKey = crypto.createPublicKey(rawPublicKey)
    const verify = crypto.createVerify('SHA256');
    verify.update(rawMessage);
    verify.end();
    return verify.verify(publicKey, signature, 'hex')
}

function rsaSign(rawPrivateKey, rawMessage) {
    const privateKey = crypto.createPrivateKey(rawPrivateKey)
    const sign = crypto.createSign('SHA256');
    sign.update(rawMessage);
    sign.end();
    return sign.sign(privateKey, 'hex')
}


module.exports = {
  VerifyRSASign: verifyRSASign,
  RSASign: rsaSign,
  MyPrivateRSAKey: `-----BEGIN PRIVATE KEY-----
MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAIh3rpGBjY6l1z5/G7UAAHBICjZpSbs0/YUKwE1h4H8heT8u0svCJdfGD+0sJH4l35QK5GB034LuzBQMri1SJt4ERVmVksllpjY/+BcMI8kF3o8SIFPqutcXYr4AG/s8/wP6JUYAa+fC20yFexPMi7hrPxMs3rb7vXWmtR1Hnwl1AgMBAAECgYB/Me4HuRTTzEde/OI6RhIilULPjDsovi89/dNXTM8OL4jvFxlqyT60ausVSHuLCInnVm+eZ9CcHS8h0N/XZibKk/1lEcw93IVzVH8YA6W76XIgmXNaRY8LX3tlNrVB7JnMJRBU5butUKrbVsocjBrPzn7asR3wOGDch5DiJvTF0QJBAL432mCeYNqqXvw0PngXuaIwUOpIkgsYYM82wwjkhss3VqY3PO5JPIuoOqounnY/UZc1ecZ/2w9DKM7Uv53onx8CQQC3qT60AIev1V5bI+8Y7SqRIrE9q2J71Y3f8Iy8IXD7uwAhCG4hko3thZkRCY6KYuHefKk1UShOggZEEGdaZAjrAkEAsPcvcFIIU4bLZaGJOJsB9fUzYjNvw2jDsCQHYP+Ss/7g2zRquFlkPZ2eLnO+ss4Hr0Bt8ZFDkLhvf7UIK/WeCwJAKPwyyvaHURzbZplZRQXABw1n4iw52QqqE3xZ263WycZMXBLGiOVsmMHEi8HHNmikoQLOu+A1j3eCsHO8rLZAKwJAHoqJX+eSDFFUk7EjH0DIyqUh60rlfY74Iy2QCcNW6/PDMWAE/T5X4CPYceFwsAqg6Zr7FJTOiluMJq+mQ3hxfw==
-----END PRIVATE KEY-----`,
  MyPublicRSAKey: `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCId66RgY2Opdc+fxu1AABwSAo2aUm7NP2FCsBNYeB/IXk/LtLLwiXXxg/tLCR+Jd+UCuRgdN+C7swUDK4tUibeBEVZlZLJZaY2P/gXDCPJBd6PEiBT6rrXF2K+ABv7PP8D+iVGAGvnwttMhXsTzIu4az8TLN62+711prUdR58JdQIDAQAB
-----END PUBLIC KEY-----`,
}
