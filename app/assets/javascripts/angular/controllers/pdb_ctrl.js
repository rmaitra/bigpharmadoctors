App.controller('PDBCtrl', ['$scope', '$http', '$location', 'Mol', '$routeParams', function($scope, $http, $location, Mol, $routeParams){


	$scope.queryPDB = function(mol){
		//mol = "2POR"
		url = 'http://www.rcsb.org/pdb/files/' + mol + ".pdb"
		document.getElementById('glmol01').innerHTML = "";
		$.ajax({ url: url, 
			success: function(data) { 
				$scope.$apply(function(){
					document.getElementById('glmol01_src').innerHTML = data;
					$scope.load_mol();
				})
			} 
		});
	}

	$scope.queryInfo = function(query){
		$.ajax({ url: query, 
			success: function(data) { 
				$scope.$apply(function(){
					array = xmlToJson(data);
					array = array.PDBdescription.PDB;
					console.log(array)
					$scope.featured_mol = array;
					$scope.get_abstract(array.attributes.pubmedId)
					$('#featured_text').fadeIn('slow');
				})
			} 
		});
	}

	// Changes XML to JSON
	function xmlToJson(xml) {
		
		// Create the return object
		var obj = {};

		if (xml.nodeType == 1) { // element
			// do attributes
			if (xml.attributes.length > 0) {
			obj["attributes"] = {};
				for (var j = 0; j < xml.attributes.length; j++) {
					var attribute = xml.attributes.item(j);
					obj["attributes"][attribute.nodeName] = attribute.nodeValue;
				}
			}
		} else if (xml.nodeType == 3) { // text
			obj = xml.nodeValue;
		}

		// do children
		if (xml.hasChildNodes()) {
			for(var i = 0; i < xml.childNodes.length; i++) {
				var item = xml.childNodes.item(i);
				var nodeName = item.nodeName;
				if (typeof(obj[nodeName]) == "undefined") {
					obj[nodeName] = xmlToJson(item);
				} else {
					if (typeof(obj[nodeName].push) == "undefined") {
						var old = obj[nodeName];
						obj[nodeName] = [];
						obj[nodeName].push(old);
					}
					obj[nodeName].push(xmlToJson(item));
				}
			}
		}
		return obj;
	};

	$scope.get_abstract = function(pubmedId){
		url = $location.absUrl() 
		url = url.split("/pdb/")
		root = url[0]
		url = root + '/mols?url=http://www.ncbi.nlm.nih.gov/pubmed/' + pubmedId;
		console.log(url)
		
		$.ajax({ url: url, 
			success: function(data) { 
				$scope.$apply(function(){
					data = data.replace('<div class=""><p>','')
					data = data.replace('</p></div>','')
					$scope.featured_abstract = data
				})
			} 
		});
	}

	$scope.read_url = function(){
		console.log()
	    url = $location.absUrl()
	    array = url.split("?id=")
	    console.log(array)
	    $scope.queryPDB(array[1])
	    $scope.queryInfo('http://www.rcsb.org/pdb/rest/describePDB?structureId='+array[1])
	}
	$scope.read_url();


	$scope.load_mol = function(){
		$scope.glmol01 = new GLmol('glmol01');

		$scope.glmol01.defineRepresentation = function(){
			idHeader = "#glmol01_";
			var time = new Date();
			var all = this.getAllAtoms();
			if ($(idHeader + 'biomt').attr('checked') && this.protein.biomtChains != "") all = this.getChain(all, this.protein.biomtChains);
			var allHet = this.getHetatms(all);
			var hetatm = this.removeSolvents(allHet);

			console.log("selection " + (+new Date() - time)); time = new Date();

			this.colorByAtom(all, {});  
			var colorMode = $(idHeader + 'color').val();
			if (colorMode == 'ss') {
			this.colorByStructure(all, 0xcc00cc, 0x00cccc);
			} else if (colorMode == 'chain') {
			this.colorByChain(all);
			} else if (colorMode == 'chainbow') {
			this.colorChainbow(all);
			} else if (colorMode == 'b') {
			this.colorByBFactor(all);
			} else if (colorMode == 'polarity') {
			this.colorByPolarity(all, 0xcc0000, 0xcccccc);
			}
			console.log("color " + (+new Date() - time)); time = new Date();

			var asu = new THREE.Object3D();
			var mainchainMode = $(idHeader + 'mainchain').val();
			var doNotSmoothen = ($(idHeader + 'doNotSmoothen').attr('checked') == 'checked');
			if ($(idHeader + 'showMainchain').attr('checked')) {
			if (mainchainMode == 'ribbon') {
			 this.drawCartoon(asu, all, doNotSmoothen);
			 this.drawCartoonNucleicAcid(asu, all);
			} else if (mainchainMode == 'thickRibbon') {
			 this.drawCartoon(asu, all, doNotSmoothen, this.thickness);
			 this.drawCartoonNucleicAcid(asu, all, null, this.thickness);
			} else if (mainchainMode == 'strand') {
			 this.drawStrand(asu, all, null, null, null, null, null, doNotSmoothen);
			 this.drawStrandNucleicAcid(asu, all);
			} else if (mainchainMode == 'chain') {
			 this.drawMainchainCurve(asu, all, this.curveWidth, 'CA', 1);
			 this.drawMainchainCurve(asu, all, this.curveWidth, 'O3\'', 1);
			} else if (mainchainMode == 'cylinderHelix') {
			 this.drawHelixAsCylinder(asu, all, 1.6);
			 this.drawCartoonNucleicAcid(asu, all);
			} else if (mainchainMode == 'tube') {
			 this.drawMainchainTube(asu, all, 'CA');
			 this.drawMainchainTube(asu, all, 'O3\''); // FIXME: 5' end problem!
			} else if (mainchainMode == 'bonds') {
			 this.drawBondsAsLine(asu, all, this.lineWidth);
			}
			}

			if ($(idHeader + 'line').attr('checked')) {
			this.drawBondsAsLine(this.modelGroup, this.getSidechains(all), this.lineWidth);
			}
			console.log("mainchain " + (+new Date() - time)); time = new Date();

			if ($(idHeader + 'showBases').attr('checked')) {
			var hetatmMode = $(idHeader + 'base').val();
			if (hetatmMode == 'nuclStick') {
			 this.drawNucleicAcidStick(this.modelGroup, all);
			} else if (hetatmMode == 'nuclLine') {
			 this.drawNucleicAcidLine(this.modelGroup, all);
			} else if (hetatmMode == 'nuclPolygon') {
			 this.drawNucleicAcidLadder(this.modelGroup, all);
			}
			}

			var target = $(idHeader + 'symopHetatms').attr('checked') ? asu : this.modelGroup;
			if ($(idHeader + 'showNonBonded').attr('checked')) {
			var nonBonded = this.getNonbonded(allHet);
			var nbMode = $(idHeader + 'nb').val();
			if (nbMode == 'nb_sphere') {
			 this.drawAtomsAsIcosahedron(target, nonBonded, 0.3, true);
			} else if (nbMode == 'nb_cross') {
			 this.drawAsCross(target, nonBonded, 0.3, true);

			}
			}

			if ($(idHeader + 'showHetatms').attr('checked')) {
			var hetatmMode = $(idHeader + 'hetatm').val();
			if (hetatmMode == 'stick') {
			 this.drawBondsAsStick(target, hetatm, this.cylinderRadius, this.cylinderRadius, true);
			} else if (hetatmMode == 'sphere') {
			 this.drawAtomsAsSphere(target, hetatm, this.sphereRadius);
			} else if (hetatmMode == 'line') {
			 this.drawBondsAsLine(target, hetatm, this.curveWidth);
			} else if (hetatmMode == 'icosahedron') {
			 this.drawAtomsAsIcosahedron(target, hetatm, this.sphereRadius);
			} else if (hetatmMode == 'ballAndStick') {
			 this.drawBondsAsStick(target, hetatm, this.cylinderRadius / 2.0, this.cylinderRadius, true, false, 0.3);
			} else if (hetatmMode == 'ballAndStick2') {
			 this.drawBondsAsStick(target, hetatm, this.cylinderRadius / 2.0, this.cylinderRadius, true, true, 0.3);
			} 

			}
			console.log("hetatms " + (+new Date() - time)); time = new Date();

			var projectionMode = $(idHeader + 'projection').val();
			if (projectionMode == 'perspective') this.camera = this.perspectiveCamera;
			else if (projectionMode == 'orthoscopic') this.camera = this.orthoscopicCamera;

			this.setBackground(parseInt($(idHeader + 'bgcolor').val()));

			if ($(idHeader + 'cell').attr('checked')) {
			this.drawUnitcell(this.modelGroup);
			}

			if ($(idHeader + 'biomt').attr('checked')) {
			this.drawSymmetryMates2(this.modelGroup, asu, this.protein.biomtMatrices);
			}
			if ($(idHeader + 'packing').attr('checked')) {
			this.drawSymmetryMatesWithTranslation2(this.modelGroup, asu, this.protein.symMat);
			}
			this.modelGroup.add(asu);
			};

		console.log($scope.glmol01)
		$('#glmol01').fadeIn('slow');

	}

    $scope.defineRepFromController = function() {
    	$scope.glmol01.defineRepresentation()
    	$scope.glmol01.rebuildScene();
    	$scope.glmol01.show();
	}

  
    
}]);

