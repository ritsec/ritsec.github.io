//sponsors.js
// Handles the swapping of sponsor images on the homepage

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
}

    
function reload_sponsors(){
    var images = [
        ['assets/images/sponsorLogos/Facebook.png', "https://www.facebook.com/careers/"],['assets/images/sponsorLogos/Carrier.png', "https://www.carrier.com/carrier/en/us/"],['assets/images/sponsorLogos/cisco.png', "https://www.cisco.com/"],['assets/images/sponsorLogos/mitre_logo.png', "https://www.mitre.org/"],['assets/images/sponsorLogos/cra.png', "https://www.crai.com/"],['assets/images/sponsorLogos/Wegmans.jpg', "https://www.wegmans.com/"],['assets/images/sponsorLogos/MINDEX-RGB.jpg', "https://www.mindex.com/"],['assets/images/sponsorLogos/BHIS.jpg', "https://www.blackhillsinfosec.com/"],['assets/images/sponsorLogos/sra.png', "https://sra.io/"],['assets/images/sponsorLogos/miscreants circle logo.png', "https://www.miscreants.co/"],
    ];
    images = shuffle(images);
    for(i=0;i<4;i++){
        var item = images[i];
        $('#sponsor'+i).attr("src", item[0]);
        $('#sponsor'+i).parent("a").attr("href", item[1]);
    }
    setTimeout(reload_sponsors, 3000);
}

$(document).ready(reload_sponsors());

//TODO Make this more efficient