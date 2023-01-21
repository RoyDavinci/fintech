<?php

$testPublicKey = 'DTH-PBK-$2y$10$wGeVqsSoeYwbIuNru8jjQOr9ThP3fbUKrJ1XSyGseaYTUklnMuXQW';
$testPrivateKey = 'DTH-PVK-$2y$10$vvZ0AFFiJ3jKyfHXAHDO8ObnCrm.wLy3ocuhLctjlWwullHSigb/K';

$livePublicKey = 'DTH-PBK-$2y$10$Qo4WriXzhKn52o3L5jeWvunG0pbDM43Yc7d57qA6d0gzu8gsSCFAa';
$livePrivateKey = 'DTH-PVK-$2y$10$UL24fzNS54x.jyH2Jv8Z0ejrA.PUiPrxq9v4fCNgFQCX3iPb4clYO';
$merchantId = "8T735W133Q4667028085073";
$allowedIp = "138.197.117.2";

$recipient = "08030873116";

$checksum = base64_encode($testPublicKey . '|' . $merchantId . '|' . $recipient . '|' . $testPrivateKey);

echo $checksum;


$encode = 'RFRILVBCSy0kMnkkMTAkd0dlVnFzU29lWXdiSXVOcnU4ampRT3I5VGhQM2ZiVUtySjFYU3lHc2VhWVRVa2xuTXVYUVd8OFQ3MzVXMTMzUTQ2NjcwMjgwODUwNzN8MDgwMzA4NzMxMTZ8RFRILVBWSy0kMnkkMTAkdnZaMEFGRmlKM2pLeWZIWEFIRE84T2JuQ3JtLndMeTNvY3VoTGN0amxXd3VsbEhTaWdiL0s=%';

$jsencode = 'RFRILVBCSy0kMnkkMTAkd0dlVnFzU29lWXdiSXVOcnU4ampRT3I5VGhQM2ZiVUtySjFYU3lHc2VhWVRVa2xuTXVYUVd8OFQ3MzVXMTMzUTQ2NjcwMjgwODUwNzN8MDgwMzA4NzMxMTZEVEgtUFZLLSQyeSQxMCR2dlowQUZGaUozakt5ZkhYQUhETzhPYm5Dcm0ud0x5M29jdWhMY3RqbFd3dWxsSFNpZ2IvSw==';
