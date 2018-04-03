// ==UserScript==
// @name         GetHistoryBet365
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Envia as informações sobre as apostas para um endereço onde são concatenadas
// @author       You
// @match        https://members.365sport365.com/Members/Services/History/SportsHistory/HistorySearch/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

getInfo=function(id,bash){
	//console.log('https://members.365sport365.com/members/services/History/SportsHistory/GetBetConfirmation?displaymode=desktop&_='+(+new Date())+'&Id='+id+'&BetStatus=0&Bcar=0&Bash='+bash+'&Pebs=0');
	$.get('https://members.365sport365.com/members/services/History/SportsHistory/GetBetConfirmation?displaymode=desktop&_='+(+new Date())+'&Id='+id+'&BetStatus=0&Bcar=0&Bash='+bash+'&Pebs=0',function(res){
		var data_hora=$(res).find('.bet-confirmation-details-timeofbet').text().trim().replace('Time of bet: ','');
		var tipo=$(res).find('.bet-confirmation-table-body-event-bet-type').text().replace('(','').replace(')','');
		var selecao=$(res).find('.bet-confirmation-table-body-selections').text().trim();
		var evento=$(res).find('.bet-confirmation-table-body-event').clone().children().remove().end().text().trim();
		var odds=Number($(res).find('.bet-confirmation-table-body-odds').text().trim());
		var stake=Number($(res).find('.bet-breakdown-body-table-body:eq(2)').text().trim());
		var retorno=Number($(res).find('.bet-breakdown-body-table-body:eq(6)').text().trim());

		GM_xmlhttpRequest({
            method: "POST",
            url: "http://aposte.me/history.php",
            headers:    {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: "data="+[data_hora,tipo,selecao,evento,odds,stake,retorno].join(',')
        });
	});
}



loop=setInterval(function(){
    if($('.bet365-show-more').css('display')=='none'){
        clearInterval(loop);
    }
    else{
        $('.bet365-show-more-button-arrow').click();

        $('[data-bash]').each(function(){
             getInfo($(this).attr('data-betid'),$(this).attr('data-bash')  );
        });
    }

},1000);
