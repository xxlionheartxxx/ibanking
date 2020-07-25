const crypto = require('crypto');
const NodeRSA = require('node-rsa');
const openpgp = require('openpgp');
const config = require('../config/config.js')
const myPrivateRSAKey = `-----BEGIN PRIVATE KEY-----
MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAIh3rpGBjY6l1z5/G7UAAHBICjZpSbs0/YUKwE1h4H8heT8u0svCJdfGD+0sJH4l35QK5GB034LuzBQMri1SJt4ERVmVksllpjY/+BcMI8kF3o8SIFPqutcXYr4AG/s8/wP6JUYAa+fC20yFexPMi7hrPxMs3rb7vXWmtR1Hnwl1AgMBAAECgYB/Me4HuRTTzEde/OI6RhIilULPjDsovi89/dNXTM8OL4jvFxlqyT60ausVSHuLCInnVm+eZ9CcHS8h0N/XZibKk/1lEcw93IVzVH8YA6W76XIgmXNaRY8LX3tlNrVB7JnMJRBU5butUKrbVsocjBrPzn7asR3wOGDch5DiJvTF0QJBAL432mCeYNqqXvw0PngXuaIwUOpIkgsYYM82wwjkhss3VqY3PO5JPIuoOqounnY/UZc1ecZ/2w9DKM7Uv53onx8CQQC3qT60AIev1V5bI+8Y7SqRIrE9q2J71Y3f8Iy8IXD7uwAhCG4hko3thZkRCY6KYuHefKk1UShOggZEEGdaZAjrAkEAsPcvcFIIU4bLZaGJOJsB9fUzYjNvw2jDsCQHYP+Ss/7g2zRquFlkPZ2eLnO+ss4Hr0Bt8ZFDkLhvf7UIK/WeCwJAKPwyyvaHURzbZplZRQXABw1n4iw52QqqE3xZ263WycZMXBLGiOVsmMHEi8HHNmikoQLOu+A1j3eCsHO8rLZAKwJAHoqJX+eSDFFUk7EjH0DIyqUh60rlfY74Iy2QCcNW6/PDMWAE/T5X4CPYceFwsAqg6Zr7FJTOiluMJq+mQ3hxfw==
-----END PRIVATE KEY-----`
const myPublicRSAKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCId66RgY2Opdc+fxu1AABwSAo2aUm7NP2FCsBNYeB/IXk/LtLLwiXXxg/tLCR+Jd+UCuRgdN+C7swUDK4tUibeBEVZlZLJZaY2P/gXDCPJBd6PEiBT6rrXF2K+ABv7PP8D+iVGAGvnwttMhXsTzIu4az8TLN62+711prUdR58JdQIDAQAB
-----END PUBLIC KEY-----`

const myPublicPGPKey = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: Keybase OpenPGP v1.0.0
Comment: https://keybase.io/crypto

xo0EXsuf1AEEANJwBRVVcmEUXJsaJjt+rVN01FNMV4OIbO1Uhf4RBxk9W/F8vqog
IG153zHUBlGN4aC1/zlM0laeFt3GPB+vCvodKOm+Xq35hO6MV4C5RMfGF54IgTDh
Dsi9O2QE/W3WOjA9AJIL6ZMkU61m5oY2NveGMXIqHxdQy3rePsgFpKjxABEBAAHN
GTM3QmFuayA8YWRtaW5AMzdiYW5rLmNvbT7CrQQTAQoAFwUCXsuf1AIbLwMLCQcD
FQoIAh4BAheAAAoJENIgBjdR0yuuupYEAMUdzdQXwF/C9nq9ZCosfJttuIciJRgM
+MXkyvms9oOZTm8w+991WNg1BSCUa81XsKdbxnChpkWAjt5NihKSsSShEkua9eEf
H357q7zfG7zHFPCgEqGMuX7w3Md2Ahe58xxYkXR+qoJNeGT45hmNM/BuW/W7dWkS
TJRe39JA/aevzo0EXsuf1AEEALXqpZM7SHGuXAinao/MgaluhJOzfJpLJ0u0PHjX
T6bjwlUAc6BM5KHqTPovFNJLUrzN/YHaU2XwndH7eMCbCCjQX2jRRBxdJMv17xS5
IsI+0shq+qAEEQWWuubl3pTHBnhiWGfAp7YXbyHEHA84Jy0cFEZntNq2UeEVYeMm
3jIlABEBAAHCwIMEGAEKAA8FAl7Ln9QFCQ8JnAACGy4AqAkQ0iAGN1HTK66dIAQZ
AQoABgUCXsuf1AAKCRBKws6fJIIstD1uA/sE3PVy5Chj0PuMY3CflJkA56RYWJ3R
AzWVoElj2FYflipfyV/axODhFTZCrp5U43jraz+UCEYLUj8cIXYo8kMQeWGdR2+Q
0DTgHNZ1YfaZYj8/Gso2yeitBZ0PmXcZtT00UsbHMUNX5E3Jyq5VZA+kWtcqqSJq
+MpfytVirU9t2iE1A/4sdS1hnaZmogf1GMlubBJS2zT9sVh8rSxAxTf+m9w9iKpm
8hVskYQMXVAgQnVRECkJEHGC/AEWOC9dWd851Gr7uSZK5brBhrBvaUKdRAdUxb11
I8bqrzcSZoGkzLBiO02VnOzwQtrTW8hVBc9/fc1m/MifYM/wm9qFbheERdaD386N
BF7Ln9QBBACbUls6w7/ru/mqkiMTwHJfJETUImnH2WWHLTdQBWM+5AC3HMMSXjhS
SYP5xeWFHSfQByBzLq+so4ImgMKA+6Gl5IsMSH7Tlq9xarsjIPCXnUhW6dp6a8AW
lctBDeWcpquB43Hh5ji36Fa4uMlNflefVUzCie6Pos+xrMhD1qXASQARAQABwsCD
BBgBCgAPBQJey5/UBQkPCZwAAhsuAKgJENIgBjdR0yuunSAEGQEKAAYFAl7Ln9QA
CgkQ9cWRoMe0p11W5QP/eESciT4aWvodL9tdO0QDR0mmu/8ksQ0V4NMt6ND7YoCb
i9EWhFIdMYItc3kDLNw/4JX9MyxEbVzXxPxee/JOFGTlV1DaRpbajJ/3Yhx1jPqc
Ez5vW8j9z3En4Wz/POG+GvBMsdwliucqPj3HZdEHuAL4v2U0JpuF2RtjTA5Sw88k
AwP/STad5rqOxLIcjSGU5vTiOdlU7GBTqPW09gO9I1vOyVepXnv5UiTf6rD1zMpC
rf4WVQSgsT52Jfd9MdY18oR9EtN/PwX+dm+JUA6GaLPGdy6tIm73um5m9veRIRdA
1aI8gwveM1wywiYm55p0XDGaHXhrSo0A8Db3gkgqPURBZ3Q=
=l6/i
-----END PGP PUBLIC KEY BLOCK-----`

const myPrivatePGPKey = `-----BEGIN PGP PRIVATE KEY BLOCK-----
Version: Keybase OpenPGP v1.0.0
Comment: https://keybase.io/crypto

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
HXhrSo0A8Db3gkgqPURBZ3Q=
=xiOK
-----END PGP PRIVATE KEY BLOCK-----`

function verifyRSASign(rawPublicKey, signature, rawMessage) {
    const publicKey = crypto.createPublicKey(rawPublicKey)
    const verify = crypto.createVerify('SHA256');
    verify.update(rawMessage);
    verify.end();
    return verify.verify(publicKey, signature, 'base64')
}

function rsaSign(rawMessage, encoding) {
    const privateKey = NodeRSA(myPrivateRSAKey)
    const buffRawMessage = new Buffer(rawMessage)
    return privateKey.sign(buffRawMessage, encoding || 'base64')
}

function bank25RSAEncrypted(rawMessage, rawPublicKey) {
    const publicKey = NodeRSA(rawPublicKey)
    const buffRawMessage = new Buffer(rawMessage)
    return publicKey.encrypt(buffRawMessage, 'base64')
}

const pgpVerify = async (sign, hash) => {
  try {
    const verified = await openpgp.verify({
    message: openpgp.cleartext.fromText(hash),              // CleartextMessage or Message object
    signature: await openpgp.signature.readArmored(sign), // parse detached signature
    publicKeys: (await openpgp.key.readArmored(myPublicPGPKey)).keys // for verification
    });
    const { valid } = verified.signatures[0];
    if (valid) {
        console.log("valid")
        console.log('signed by key id ' + verified.signatures[0].keyid.toHex());
    } else {
        throw new Error('signature could not be verified');
    }
  } catch (error) {
    console.log("er")
    console.log(error)
  }
}

const pgpSign = async (data) => {
  try {
    const passphrase = config.myBankName; // what the private key is encrypted with
    const { keys:[privateKey]}  = await openpgp.key.readArmored(myPrivatePGPKey);
    await privateKey.decrypt(passphrase);
 
    const { signature: detachedSignature } = await openpgp.sign({
        message: openpgp.cleartext.fromText(data), // CleartextMessage or Message object
        privateKeys: [privateKey],                            // for signing
        detached: true
    });
    await pgpVerify(detachedSignature, data)
    return JSON.stringify(detachedSignature);
  } catch (error) {
    console.log(error)
  }
}
module.exports = {
  VerifyRSASign: verifyRSASign,
  RSASign: rsaSign,
  PGPSign: pgpSign,
  PGPVerify: pgpVerify,
  Bank25RSAEncrypted: bank25RSAEncrypted
}
