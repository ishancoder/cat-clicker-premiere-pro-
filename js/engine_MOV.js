$(document).ready(function(){
	//the model of how data is stored
	var model = {
		currentCat : null,
		cats:[
			{
				name:'The Cat',
				URL:'images/first.png',
				clicks:0
			},
			{
				name:'Another Cat',
				URL:'images/second.png',
				clicks:0
			},
			{
				name:'Kitty',
				URL:'images/third.png',
				clicks:0
			},
			{
				name:'Big Cat',
				URL:'images/fourth.png',
				clicks:0
			},
			{
				name:'Small Cat',
				URL:'images/fifth.png',
				clicks:0
			}
		]
	}

	//what the user see and interacts with
	var view = {
		init: function(){
			this.catList = $("#catlist");
			this.catArea = $("#catarea");
			this.render();
		},
		renderList: function(){
			var htmlList = "";
			octopus.getAllCats().forEach(function(cat){
				htmlList += "<li>"+cat.name+"</li>"
			});

			this.catList.html(htmlList);

			$("#catlist > li").on('click',function(evt){
				var clickedCatsName = $(this).text();
				var cat = octopus.getAllCats().filter(function(cat){
						return cat.name == clickedCatsName;
				})[0];
				octopus.setCurrentCat(cat);
				view.renderCatArea();
			});
		},
		renderCatArea: function(){
			var current = octopus.getCurrentCat();
			if(current) {
				var catArea = "<img class=\"col-1\" src=\""+current.URL+"\">"+
						"<h2>"+current.name+"</h2>" + 
						"<h3>Clicked :"+ current.clicks +" Times</h3>";
				catArea +=	"<button type='button' id='admin-button'>Admin</button><div id = 'admin-button-panel' style='display:none;'>"+
							"<br><form>"+
								"<input type='text' placeholder='Cat Name' id='updateCatName'/><br>"+
								"<input type='text' placeholder='Cat URL' id='updateCatURL'/>"+
								"<br><input type='submit' value='save'/>"+
							"<button type='button' id='cancel-button'>Cancel</button></form></div>";

				this.catArea.html(catArea);

				$("#updateCatName").val(current.name);
				$("#updateCatURL").val(current.URL);

				$("#catarea > img").on('click',function(){
					current.clicks += 1;
					view.renderCatArea();
				});

				$("#admin-button-panel > form").submit(function(evt){
					var newName = $("#updateCatName").val();
					var newURL = $("#updateCatURL").val();
					octopus.updateCat(newName, newURL);
					evt.preventDefault();
				});

				$("#cancel-button").on('click',function(){
					view.togglePanel("admin-button-panel");
				});

				$("#admin-button").on('click',function(){
					view.togglePanel("admin-button-panel");
				});
			}
		},
		togglePanel: function(id){
			$("#"+id).toggle();
		},
		render: function(){
			this.renderList();
			this.renderCatArea();
		}
	}

	//octopus just connects the model with the view
	var octopus = {
		addNewCat: function(catName,catPath){
			model.add({
				name: catName,
				URL: catPath,
				clicks:0
			});
			view.render();
		},
		getAllCats: function(){
			return model.cats;
		},
		init: function(){
			model.currentCat = model.cats[0];
			view.init();
		},
		getCurrentCat: function(){
			return model.currentCat;
		},
		setCurrentCat: function(cat){
			model.currentCat = cat;
		},
		openCloseAdminPanel: function(id){
			view.togglePanel(id);
		},
		updateCat: function(newName,newURL){
			var current = this.getCurrentCat();
			current.name = newName;
			current.URL = newURL;
			view.render();
		}
	}

	octopus.init();
});
