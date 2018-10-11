---
---
//sponsors.js
// Handles the swapping of sponsor images on the homepage
$(document).ready(function(){
    var images = [
        {% for sponsor in site.data.sponsors %}['assets/images/sponsorLogos/{{ sponsor.image }}', "{{ sponsor.name }}"],{% endfor %}
    ];

    for(i=0;i<images.length;i++){
        var index = Math.floor(Math.random()*images.length)
        var item = images[index];
        $('#sponsor'+i).attr("src", item[0]);
        $('#sponsor'+i).parent("a").attr("href", item[1]);
        images.splice(index,1);
    }
});
