(function(){

	console.log('Ignore Online');

	//Initialize the baddies arr
	var baddiesList = [];
	var listLoaded = false;
	var listAlreadyChecked = false;

	//Initialize all the storages if there are none
	chrome.storage.sync.get('ignoreList', function(obj){
		
		//Check if list exists
		if(obj.ignoreList == undefined){

			// if there's none - set the empty list
			chrome.storage.sync.set({'ignoreList': []}); 
		}else{
			baddiesList = obj.ignoreList;
			console.log('Baddies', baddiesList);

			addBaddie('epichater'); //Test subject
			//delBaddie('epichater'); //Test subject
		}
	});

	//Add baddies function
	var addBaddie = function(baddie){

		//Check if already a baddie
		if(baddiesList.indexOf(baddie) == -1){
			baddiesList.push(baddie);

			//Push into storage
			chrome.storage.sync.set({'ignoreList': baddiesList}, function(){
				console.log('Baddie "'+baddie+'" saved!');
			});
		}
	}

	//Remove baddies function
	var delBaddie = function(baddie){

		//Check if is in list
		if(baddiesList.indexOf(baddie) != -1){
			baddiesList.splice(baddiesList.indexOf(baddie), 1);

			//Push into storage
			chrome.storage.sync.set({'ignoreList': baddiesList}, function(){
				console.log('Baddie "'+baddie+'" removed!');
			});
		}
	}
	
	//Bind function fire up on activity check
	$('.rightTopItems').hover(function(){
		var self = $(this);

		//Set timeout for DOM to change
		setInterval(function(){
			if($('#activity-scroller').text() != '' && $('.loadingIco').css('display') == 'none'){
				
				//Check again if was a false-trigger
				setTimeout(function(){
					if($('#activity-scroller').text() != ''){
						if(!listAlreadyChecked){
							//Check list if hasn't been checked
							checkForBaddies(self.find('.activityList'));	
						}else{
							//Checked already
						}
						
					}
				}, 100);
			}
		}, 50);
	}, 
	function(){
		setTimeout(function(){
			listAlreadyChecked = false;
		},300);
	});

	/**
	* Universal check function
	* checks if baddies are in the notifications
	* baddies are fetched form the sync storage
	*/
	var checkForBaddies = function(element){
		$(element).find('.notifyMsg strong').each(function(){
			var suspect = $(this);
			for (var i = baddiesList.length - 1; i >= 0; i--) {
				if(suspect.text().indexOf(baddiesList[i]) != -1){
					suspect.parent().parent().parent().parent().remove();
				}
			};
		})
		listAlreadyChecked = true;
	}

})();