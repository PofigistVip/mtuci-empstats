Z8.define('org.mtuci.empstats.CryptoPro', {
	shortClassName: 'CryptoPro',

	statics: {
		browser: null,

		JSModuleVersion: '2.1.0',
		CAPICOM_LOCAL_MACHINE_STORE: 1,
		CAPICOM_CURRENT_USER_STORE: 2,
		CADESCOM_LOCAL_MACHINE_STORE: 1,
		CADESCOM_CURRENT_USER_STORE: 2,
		CADESCOM_CONTAINER_STORE: 100,

		CAPICOM_MY_STORE: 'My',

		CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED: 2,

		CADESCOM_XML_SIGNATURE_TYPE_ENVELOPED: 0,
		CADESCOM_XML_SIGNATURE_TYPE_ENVELOPING: 1,
		CADESCOM_XML_SIGNATURE_TYPE_TEMPLATE: 2,

		XmlDsigGost3410UrlObsolete: 'http://www.w3.org/2001/04/xmldsig-more#gostr34102001-gostr3411',
		XmlDsigGost3411UrlObsolete: 'http://www.w3.org/2001/04/xmldsig-more#gostr3411',
		XmlDsigGost3410Url: 'urn:ietf:params:xml:ns:cpxmlsec:algorithms:gostr34102001-gostr3411',
		XmlDsigGost3411Url: 'urn:ietf:params:xml:ns:cpxmlsec:algorithms:gostr3411',

		CADESCOM_CADES_DEFAULT: 0,
		CADESCOM_CADES_BES: 1,
		CADESCOM_CADES_T: 0x5,
		CADESCOM_CADES_X_LONG_TYPE_1: 0x5d,
		CADESCOM_PKCS7_TYPE: 0xffff,

		CADESCOM_ENCODE_BASE64: 0,
		CADESCOM_ENCODE_BINARY: 1,
		CADESCOM_ENCODE_ANY: -1,

		CAPICOM_CERTIFICATE_INCLUDE_CHAIN_EXCEPT_ROOT: 0,
		CAPICOM_CERTIFICATE_INCLUDE_WHOLE_CHAIN: 1,
		CAPICOM_CERTIFICATE_INCLUDE_END_ENTITY_ONLY: 2,

		CAPICOM_CERT_INFO_SUBJECT_SIMPLE_NAME: 0,
		CAPICOM_CERT_INFO_ISSUER_SIMPLE_NAME: 1,

		CAPICOM_CERTIFICATE_FIND_SHA1_HASH: 0,
		CAPICOM_CERTIFICATE_FIND_SUBJECT_NAME: 1,
		CAPICOM_CERTIFICATE_FIND_ISSUER_NAME: 2,
		CAPICOM_CERTIFICATE_FIND_ROOT_NAME: 3,
		CAPICOM_CERTIFICATE_FIND_TEMPLATE_NAME: 4,
		CAPICOM_CERTIFICATE_FIND_EXTENSION: 5,
		CAPICOM_CERTIFICATE_FIND_EXTENDED_PROPERTY: 6,
		CAPICOM_CERTIFICATE_FIND_APPLICATION_POLICY: 7,
		CAPICOM_CERTIFICATE_FIND_CERTIFICATE_POLICY: 8,
		CAPICOM_CERTIFICATE_FIND_TIME_VALID: 9,
		CAPICOM_CERTIFICATE_FIND_TIME_NOT_YET_VALID: 10,
		CAPICOM_CERTIFICATE_FIND_TIME_EXPIRED: 11,
		CAPICOM_CERTIFICATE_FIND_KEY_USAGE: 12,

		CAPICOM_DIGITAL_SIGNATURE_KEY_USAGE: 128,

		CAPICOM_PROPID_ENHKEY_USAGE: 9,

		CAPICOM_OID_OTHER: 0,
		CAPICOM_OID_KEY_USAGE_EXTENSION: 10,

		CAPICOM_EKU_CLIENT_AUTH: 2,
		CAPICOM_EKU_SMARTCARD_LOGON: 5,
		CAPICOM_EKU_OTHER: 0,

		CAPICOM_AUTHENTICATED_ATTRIBUTE_SIGNING_TIME: 0,
		CADESCOM_AUTHENTICATED_ATTRIBUTE_DOCUMENT_NAME: 1,
		CADESCOM_AUTHENTICATED_ATTRIBUTE_DOCUMENT_DESCRIPTION: 2,
		CADESCOM_ATTRIBUTE_OTHER: -1,

		CADESCOM_STRING_TO_UCS2LE: 0,
		CADESCOM_BASE64_TO_BINARY: 1,

		CADESCOM_DISPLAY_DATA_NONE: 0,
		CADESCOM_DISPLAY_DATA_CONTENT: 1,
		CADESCOM_DISPLAY_DATA_ATTRIBUTE: 2,

		CADESCOM_ENCRYPTION_ALGORITHM_RC2: 0,
		CADESCOM_ENCRYPTION_ALGORITHM_RC4: 1,
		CADESCOM_ENCRYPTION_ALGORITHM_DES: 2,
		CADESCOM_ENCRYPTION_ALGORITHM_3DES: 3,
		CADESCOM_ENCRYPTION_ALGORITHM_AES: 4,
		CADESCOM_ENCRYPTION_ALGORITHM_GOST_28147_89: 25,

		CADESCOM_HASH_ALGORITHM_SHA1: 0,
		CADESCOM_HASH_ALGORITHM_MD2: 1,
		CADESCOM_HASH_ALGORITHM_MD4: 2,
		CADESCOM_HASH_ALGORITHM_MD5: 3,
		CADESCOM_HASH_ALGORITHM_SHA_256: 4,
		CADESCOM_HASH_ALGORITHM_SHA_384: 5,
		CADESCOM_HASH_ALGORITHM_SHA_512: 6,
		CADESCOM_HASH_ALGORITHM_CP_GOST_3411: 100,
		CADESCOM_HASH_ALGORITHM_CP_GOST_3411_2012_256: 101,
		CADESCOM_HASH_ALGORITHM_CP_GOST_3411_2012_512: 102,

		LOG_LEVEL_DEBUG: 4,
		LOG_LEVEL_INFO: 2,
		LOG_LEVEL_ERROR: 1,

		local_encode: true,
		local_algorithm: 1, // CADES_BES
		local_detached: false,

		getBrowser: function() {
			if(CryptoPro.browser != null)
				return CryptoPro.browser;

			var version;
			var agent = navigator.userAgent;
			var matches = agent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
			if(/trident/i.test(matches[1])) {
				version = /\brv[ :]+(\d+)/g.exec(agent) || [];
				return { name: 'IE', version: (version[1] || '') };
			}

			if(matches[1] == 'Chrome') {
				version = agent.match(/\b(OPR|Edge)\/(\d+)/);
				if(version != null)
					return { name: version[1].replace('OPR', 'Opera'), version: version[2] };
			}

			matches = matches[2] ? [matches[1], matches[2]] : [navigator.appName, navigator.appVersion, '-?'];

			if((version = agent.match(/version\/(\d+)/i)) != null)
				matches.splice(1, 1, version[1]);

			return CryptoPro.browser = { name: matches[0], version: matches[1] };
		},

		isOpera: function() {
			return CryptoPro.getBrowser().name == 'Opera';
		},

		isFireFox: function() {
			return CryptoPro.getBrowser().name == 'Firefox';
		},

		isEdge: function() {
			return CryptoPro.getBrowser().name == 'Edge';
		},

		decimalToHexString: function(number) {
			if(number < 0)
				number = 0xFFFFFFFF + number + 1;
			return number.toString(16).toUpperCase();
		},

		loadScript: function(url, onLoad, onError) {
			if(CryptoPro.script != null) {
				onLoad();
				return;
			}

			var loadCallback = onLoad;
			var errorCallback = function(error) {
				script.parentNode.removeChild(script);
				script.onload = script.onerror = null;
				CryptoPro.script = null;
				onError(error);
			}

			var script = CryptoPro.script = document.createElement('script');
			script.setAttribute('type', 'text/javascript');
			script.setAttribute('src', url);
			script.onerror = errorCallback;
			script.onload = loadCallback;
			document.getElementsByTagName('head')[0].appendChild(script);
		},

		onLoadApi: function() {
			window.postMessage('cadesplugin_echo_request', '*');
			if(!CryptoPro.listenerAdded) {
				window.addEventListener('message', function(event) {
					if(typeof(event.data) != 'string' || !event.data.match('cadesplugin_loaded'))
						return;
	
					var loadCallback = function() {
						cpcsp_chrome_nmcades.check_chrome_plugin(CryptoPro.onLoad, CryptoPro.onError);
					};
	
					if(CryptoPro.isFireFox() || CryptoPro.isEdge()) {
						// Для Firefox вместе с сообщением cadesplugin_loaded прилетает url для загрузки nmcades_plugin_api.js
						var url = event.data.substring(event.data.indexOf('url:') + 4);
						CryptoPro.loadScript(url, loadCallback, CryptoPro.onError);
					} else
						loadCallback();
				});

				CryptoPro.listenerAdded = true;
			}
		},

		loadExtension: function() {
			if(CryptoPro.isFireFox() || CryptoPro.isEdge()) {
				CryptoPro.onLoadApi();
			} else {
				var url = CryptoPro.isOpera() ? 
					'chrome-extension://epebfcehmdedogndhlcacafjaacknbcm/nmcades_plugin_api.js' :
					'chrome-extension://iifchhfnnmpdbibifmljnfjhpififfog/nmcades_plugin_api.js';
				CryptoPro.loadScript(url, CryptoPro.onLoadApi, CryptoPro.onError);
			}
		},

		onLoad: function() {
			CryptoPro.spawn(CryptoPro.loadPluginInfoGenerator, function(info) {
				CryptoPro.resolve(info);
			});
		},

		onError: function(message) {
			if(message == undefined || typeof(message) == 'object')
				message = 'Плагин недоступен';
			CryptoPro.reject(message);
		},

		set: function(object) {
			CryptoPro.object = object;
		},

		getLastError: function(exception) {
			var message = exception.message;
			return message != null ? (exception.number ? message + ' (0x' + decimalToHexString(exception.number) + ')' : message) : exception;
		},

		CreateObjectAsync: function(name) {
			return CryptoPro.object.CreateObjectAsync(name);
		},

		ReleasePluginObjects: function() {
			return cpcsp_chrome_nmcades.ReleasePluginObjects();
		},

		spawn: function(generatorFunc) {
			function continuer(verb, arg) {
				var result;
				try {
					result = generator[verb](arg);
				} catch(err) {
					return Promise.reject(arg);
				}
				if(result.done) {
					return result.value;
				} else {
					return Promise.resolve(result.value).then(onFulfilled, onRejected);
				}
			}
			var generator = generatorFunc.apply(CryptoPro, Array.prototype.slice.call(arguments, 1));
			var onFulfilled = continuer.bind(continuer, 'next');
			var onRejected = continuer.bind(continuer, 'throw');
			return onFulfilled();
		},

		async_spawn: function(generatorFunc) {
			function continuer(verb, arg) {
				var result;
				try {
					result = generator[verb](arg);
				} catch(err) {
					return Promise.reject(arg);
				}
				if(result.done) {
					return result.value;
				} else {
					return Promise.resolve(result.value).then(onFulfilled, onRejected);
				}
			}
			var generator = generatorFunc(Array.prototype.slice.call(arguments, 1));
			var onFulfilled = continuer.bind(continuer, 'next');
			var onRejected = continuer.bind(continuer, 'throw');
			return onFulfilled();
		},

		loadPluginInfoGenerator: function*(callback) {
			var major = 2, minor = 0, build = 13064;

			var about = yield CryptoPro.CreateObjectAsync('CAdESCOM.About');
			var currentVersion = yield about.PluginVersion;

			var isActualVersion = true;
			if((yield currentVersion.MajorVersion) == major) {
				if((yield currentVersion.MinorVersion) == minor) {
					if((yield currentVersion.BuildVersion) == build)
						isActualVersion = true;
					else if ((yield currentVersion.BuildVersion) < build)
						isActualVersion = false;
				} else if ((yield currentVersion.MinorVersion) < minor)
					isActualVersion = false;
			} else if((yield currentVersion.MajorVersion) < major)
				isActualVersion = false;

			var version = yield about.CSPVersion('', 75);

			var info = {
				pluginVersion: yield currentVersion.toString(),
				isActualVersion: isActualVersion,
				cspVersion: (yield version.MajorVersion) + '.' + (yield version.MinorVersion) + '.' + (yield version.BuildVersion),
				cspName: yield about.CSPName(75)
			};

			callback(CryptoPro.info = info);
		},

		loadCertificatesGenerator: function*(onLoad, onError) {
			try {
				var store = yield CryptoPro.CreateObjectAsync('CAdESCOM.Store');
				yield store.Open();
			} catch (ex) {
				onError('Ошибка при открытии хранилища сертификатов: ' + CryptoPro.getLastError(ex));
				return;
			}

			var result = [];

			extractNames = function(text, names) {
				if (Z8.isEmpty(text) || Z8.isEmpty(names))
					return text;
				var values = [];
				for (var i = 0, n = names.length; i < n; i++) {
					var matches = text.match(new RegExp(names[i] + '=([^,]*)'));
					if (matches != null)
						values.push(matches[1]);
				}
				return values.length == 0 ? text : values.join(' ');
			};

			try {
				var certificates = yield store.Certificates;
				var count = yield certificates.Count;

				for(var i = 1; i <= count; i++) {
					var certificate = yield certificates.Item(i);
					var validTill = new Date((yield certificate.ValidToDate));

					if(!(yield (yield certificate.IsValid()).Result) || validTill < new Date() || !(yield certificate.HasPrivateKey()))
						continue;

					var id = (yield certificate.Thumbprint).split(' ').reverse().join('').replace(/\s/g, '').toUpperCase();
					var validFrom = new Date((yield certificate.ValidFromDate));
					var subject = yield certificate.SubjectName;
					var issuer = yield certificate.IssuerName;
					var serialNumber = yield certificate.SerialNumber;

					var provider = yield (yield certificate.PrivateKey).ProviderName;
					var algorithm = yield (yield (yield certificate.PublicKey()).Algorithm).FriendlyName;

					result.push({
						id: id,
						owner: extractNames(subject, ['SN', 'G']),
						serialNumber: serialNumber,
						validFrom: validFrom.toISOString(),
						validTill: validTill.toISOString(),
						issuer: extractNames(issuer, ['CN']),
						provider: provider,
						algorithm: algorithm
					});
				}

				onLoad(result);
			} catch (ex) {
				onError('Ошибка при перечислении сертификатов: ' + CryptoPro.getLastError(ex));
			} finally {
				yield store.Close();
			}
		},

		signGenerator: function*(id, data, onSuccess, onError) {
			try {
				var store = yield CryptoPro.CreateObjectAsync('CAdESCOM.Store');
				yield store.Open();
			} catch(ex) {
				onError('Ошибка при открытии хранилища сертификатов: ' + CryptoPro.getLastError(ex));
				return;
			}

			var certificates = yield (yield store.Certificates).Find(CryptoPro.CAPICOM_CERTIFICATE_FIND_SHA1_HASH, id);

			if ((yield certificates.Count) == 0) {
				onError('Сертификат ' + certificate.id + ' не найден');
				return;
			}

			try {
				var signer = yield CryptoPro.CreateObjectAsync('CAdESCOM.CPSigner');
				yield signer.propset_Options(CryptoPro.CAPICOM_CERTIFICATE_INCLUDE_WHOLE_CHAIN);

				var attributes = yield signer.AuthenticatedAttributes2;

				var signingTime = yield CryptoPro.CreateObjectAsync('CADESCOM.CPAttribute');
				yield signingTime.propset_Name(CryptoPro.CAPICOM_AUTHENTICATED_ATTRIBUTE_SIGNING_TIME);
				yield signingTime.propset_Value(new Date());
				yield attributes.Add(signingTime);

				var documentName = yield CryptoPro.CreateObjectAsync('CADESCOM.CPAttribute');
				yield documentName.propset_Name(CryptoPro.CADESCOM_AUTHENTICATED_ATTRIBUTE_DOCUMENT_NAME);
				yield documentName.propset_Value('Document Name');
				yield attributes.Add(documentName);

				var certificate = yield certificates.Item(1);
				yield signer.propset_Certificate(certificate);

				var signedData = yield CryptoPro.CreateObjectAsync('CAdESCOM.CadesSignedData');
				yield signedData.propset_ContentEncoding(CryptoPro.CADESCOM_BASE64_TO_BINARY);
				yield signedData.propset_Content(CryptoPro.local_encode ? Base64.encode(data) : data);

				onSuccess(yield signedData.SignCades(signer, CryptoPro.local_algorithm, CryptoPro.local_detached));
			} catch (err) {
				onError('Не удалось создать подпись: ' + CryptoPro.getLastError(err));
			} finally {
				yield store.Close();
			}
		},

		initialize: function(onSuccess, onError) {
			if(CryptoPro.info != null) {
				onSuccess(CryptoPro.info);
				return;
			}

			new Promise(function(resolve, reject) {
				CryptoPro.resolve = resolve;
				CryptoPro.reject = reject;
				CryptoPro.loadExtension();
			}).then(onSuccess, onError);
		},

		loadCertificates: function(onLoad, onError) {
			CryptoPro.initialize(
				function(info) { CryptoPro.spawn(CryptoPro.loadCertificatesGenerator, onLoad, onError); },
				onError
			);
		},

		sign: function(certificate, data, onSuccess, onError) {
			CryptoPro.initialize(
				function(info) { CryptoPro.spawn(CryptoPro.signGenerator, certificate, data, onSuccess, onError); },
				onError
			);
		}
	}
});

window.cadesplugin = CryptoPro;
