Z8.define('org.mtuci.empstats.module.emps.view.Табели.Listbox.Item', {
	extend: 'ListItem',

	htmlMarkup: function() {
		var markup = this.callParent();

		var record = this.record;
		var color = this.getColor(record);
		if (color != null)
			markup.style = "background-color: " + color;

		return markup;
	},

	onRecordChange: function(record, modified) {
		this.callParent(record, modified);
		var color = this.getColor(record);
		if (color != null)
			DOM.setAttribute(this, 'style', "background-color: " + color);
	},

	getColor: function(record) {
		if (record == null)
			return null;
		var color = null;
		var статус = record.get('статусId');
		var корректировка = record.get('номерКорректировки');
		if (статус == Статус.Отклонен)
			color = Colors.Red; //red
		else if (корректировка > 0)
			color = Colors.Blue; //'blue';
		else if (статус == Статус.Принят)
			color = Colors.Green; //green
		else if (статус == Статус.ПроверкаК || статус == Статус.ПроверкаБ)
			color = Colors.Yellow; //yellow
		return color;
	}
});

Z8.define('org.mtuci.empstats.module.emps.view.Табели.Табель', {
	extend: 'Кадры_Табели_ТабельControl',
	shortClassName: 'Кадры_Табели_Табель',

	initComponent: function() {
		this.callParent();

		this.checks = false;
		this.locks = false;
	}
});

Z8.define('org.mtuci.empstats.module.emps.view.Табели.КорректировкаAction', {
	extend: 'Z8.form.action.Action',
	shortClassName: 'Кадры_Табели_КорректировкаAction',

	onActionComplete: function(record, response, success) {
		if(success && record != null && this.getRecord() == record) {
			if (response.корректировкаId) {
				var табели = Кадры_Табели_Табель.Me;
				Кадры_Табели_Табель.КорректировкаId = response.корректировкаId;
				табели.refreshRecords(табели.refreshButton);
				
			}
		}
	}
});

Z8.define('org.mtuci.empstats.module.emps.view.Табели.Listbox.List', {
	extend: 'Z8.list.List',

	itemType: 'org.mtuci.empstats.module.emps.view.Табели.Listbox.Item',

	createHeader: function(field, cls) {
		if (['половинаStr'].includes(field.name))
			return Z8.create('Z8.list.HeaderIcon', { list: this, field: field, cls: cls });
		return this.callParent(field, cls);
	},
});

Z8.define('org.mtuci.empstats.module.emps.view.Табели.Listbox', {
	extend: 'Z8.form.field.Listbox',

	listCls: 'org.mtuci.empstats.module.emps.view.Табели.Listbox.List',
	itemType: 'org.mtuci.empstats.module.emps.view.Табели.Listbox.Item',

	createList: function() {
		var list = this.callParent();
		var headers = list.getHeaders();
		var getWidth2 = function() { return 2.5 };
		var getWidth10 = function() { return 10 };
		for (var i = 0; i < headers.length; ++i) {
			var header = headers[i];
			if (header.field && header.field.name == 'половинаStr') {
				header.fixed = true;
				header.getWidth = getWidth2;
			}
		}
		return list;
	},
});

Z8.define('org.mtuci.empstats.module.emps.view.Табели', {
	extend: 'Z8.application.form.Navigator',
	shortClassName: 'Кадры_Табели',

	statics: {
		Me: null,
		КорректировкаId: null,
	},

	listboxType: 'org.mtuci.empstats.module.emps.view.Табели.Listbox',

	constructor: function(config) {
		this.callParent(config);

		var store = this.store;
		var accessFn = function() { return false; };
		store.hasCreateAccess = accessFn;
		store.hasCopyAccess = accessFn;
		store.hasDestroyAccess = accessFn;
	},

	initComponent: function() {
		this.callParent();

		var admin = User.isAdministrator();
		var form = this.form;

		this.действия = form.getField('actionGroup');

		this.табельTabs = form.getControl('табельTabs');

		this.табельTab = form.getField('табельTab');
		this.табель = form.getField('табель');

		this.версииTab = form.getField('версииTab');
		this.версииListbox = this.версииTab.getControl('версии');

		var подписать = this.подписать = form.getField('подписать');
		подписать.on('complete', this.onТабельAction, this);
		if (window._DEBUG_ === true)
			подписать.handler = this.onПодписать1;
		else
			подписать.handler = this.onПодписать;
		подписать.scope = this;

		var переформировать = this.переформировать = form.getField('переформировать');
		переформировать.on('complete', this.onТабельAction, this);

		if (admin) {
			var создатьТабель = this.создатьТабель = form.getField('создатьТабель');
			создатьТабель.on('complete', this.onТабельAction, this);
			создатьТабель.handler = this.onСоздать;
			создатьТабель.scope = this;
		}

		var принятьОК = this.принятьОК = form.getField('принятьОК');
		принятьОК.on('complete', this.onТабельAction, this);

		var принятьБ = this.принятьБ = form.getField('принятьБ');
		принятьБ.on('complete', this.onТабельAction, this);

		var отклонитьОК = this.отклонитьОК = form.getField('отклонитьОК');
		отклонитьОК.on('complete', this.onТабельAction, this);
		отклонитьОК.handler = this.onОтклонить;
		отклонитьОК.scope = this;

		var отклонитьБ = this.отклонитьБ = form.getField('отклонитьБ');
		отклонитьБ.on('complete', this.onТабельAction, this);
		отклонитьБ.handler = this.onОтклонить;
		отклонитьБ.scope = this;

		var создатьКорректировку = this.создатьКорректировку = form.getField('создатьКорректировку');
		создатьКорректировку.on('complete', this.onТабельAction, this);

		var обнулитьТабель = this.обнулитьТабель = form.getField('обнулитьТабель');
		обнулитьТабель.on('complete', this.onТабельAction, this);

		var создатьТабель = this.создатьТабель = form.getField('создатьТабель');
		if (создатьТабель)
			создатьТабель.on('complete', this.forceUpdate, this);

		var удалить = this.удалить = form.getField('удалить');
		if (удалить)
			удалить.on('complete', this.forceUpdate, this);

		form.on('change', this.onFormChange, this);
		this.listbox.on('contentChange', this.выбратьКорректировку, this);
		Кадры_Табели_Табель.Me = this;

		this.store.on('beforeLoad', this.onBeforeLoad, this);
	},

	onBeforeLoad: function(store, params) {
		if (params.period.active == false) {
			delete params.period;
		}
	},

	выбратьКорректировку: function() {
		if (Кадры_Табели_Табель.КорректировкаId != null) {
			var items = this.listbox.list.getItems();
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				if (item.record.id == Кадры_Табели_Табель.КорректировкаId) {
					this.listbox.select(item);
					break;
				}
			}
			Кадры_Табели_Табель.КорректировкаId = null;
		}
	},

	createTools: function() {
		var tools = this.callParent();

		if (this.copyButton != null) {
			tools.remove(this.copyButton);
			this.copyButton = null;
		}

		return tools;
	},

	htmlMarkup: function() {
		this.cls = DOM.parseCls(this.cls).pushIf('кадры').pushIf('табели');
		return this.callParent();
	},

	getListboxConfig: function() {
		var config = this.callParent();
		config.checks = false;
		config.locks = false;
		return config;
	},

	createItems: function() {
		return this.createForm();
	},

	createPrintButton: function() {
		return null;
	},

	createFormTableGroup: function() {
		return null;
	},

	completeRender: function() {
		this.callParent();
		this.updateButtons(null);
	},

	onFormChange: function(form, newRecord, oldRecord) {
		this.updateButtons(newRecord);
	},

	forceUpdate: function() {
		this.refreshRecords(this.refreshButton);
	},

	onТабельAction: function(action, record) {
		this.updateButtons(record);
	},

	updateButtons: function(record) {
		if (record == null)
			return;

		var oneRecord = this.oneRecord;
		var статус = record != null ? record.get('статусId') : null;
		var сообщение = record != null ? record.get('сообщение') : null;

		this.табельTabs.showTab(this.версииTab, !oneRecord);
		DOM.swapCls(this.табельTab.dom.firstChild, Z8.isEmpty(сообщение), 'display-none');

		var кадровик = User.кадровик();
		var табельщик = User.табельщик();
		var бухгалтер = User.бухгалтер();
		var admin = User.isAdministrator();

		this.подписать.show(!oneRecord && табельщик);
		this.создатьКорректировку.show(!oneRecord && табельщик);
		this.обнулитьТабель.show(!oneRecord && табельщик);
		this.переформировать.show(!oneRecord && (табельщик || admin));

		this.отклонитьОК.show(!oneRecord && кадровик);
		this.принятьОК.show(!oneRecord && кадровик);

		this.отклонитьБ.show(!oneRecord && бухгалтер);
		this.принятьБ.show(!oneRecord && бухгалтер);

		if (табельщик) {
			this.подписать.setEnabled(статус == Статус.Черновик || статус == Статус.Отклонен);
			this.создатьКорректировку.setEnabled(статус == Статус.Принят);
			this.обнулитьТабель.setEnabled(статус == Статус.Черновик);
			this.переформировать.setEnabled(статус == Статус.Черновик || статус == Статус.Отклонен);
		}
		if (бухгалтер) {
			this.принятьБ.setEnabled(статус == Статус.ПроверкаБ);
			this.отклонитьБ.setEnabled(статус == Статус.ПроверкаБ);
		} else if (кадровик) {
			this.принятьОК.setEnabled(статус == Статус.ПроверкаК);
			this.отклонитьОК.setEnabled(статус == Статус.ПроверкаК);
			this.обнулитьТабель.setEnabled(статус == Статус.Черновик);
		}
		this.табель.setReadOnly(!табельщик
				|| (статус != Статус.Черновик && статус != Статус.Отклонен));
		this.действия.show();
	},

	onОтклонить: function(button) {
		var validation = {
			fn: function(control, valid) {
				if(dialog != null)
					dialog.okButton.setEnabled(valid);
			},
			scope: this
		};

		var text = new Z8.form.field.TextArea({ placeholder: 'Укажите причину', label: false, flex: 1, required: true, validation: validation });

		var callback = function(dialog, success) {
			if(!success) {
				button.setBusy(false);
				return;
			}

			button.action.parameters[0].value = text.getValue();
			button.runAction();
		};

		var dialog = new Z8.window.Window({ cls: 'отклонить-табель', header: 'Укажите причину', icon: 'fa-reply', autoClose: true, controls: [text], text: text, handler: callback, scope: this });
		dialog.open();
		dialog.okButton.setEnabled(false);
	},

	onСоздать: function(button) {
		var validation = {
			fn: function(control, valid) {
				if(dialog != null)
					dialog.okButton.setEnabled(valid);
			},
			scope: this
		};

		var text = new Z8.form.field.TextArea({ placeholder: 'Укажите причину', label: false, flex: 1, required: true, validation: validation });
		var период = new DateBox({ placeholder: 'Период', required: true, validation: validation });

		var подразделение = Z8.form.Helper.createControl({
			isCombobox: true,
			label: false,
			type: 'string', name: 'name', header: 'Код',
			columns: [
					{ type: 'string', name: 'shortName', header: 'Название' }
			],
			query:{
				request: 'org.mtuci.empstats.module.emps.view.Подразделения',
				fields:[
					{ name: 'shortName', type: 'string' },
					{ name: 'name', type: 'string' }
				],
				limit: 500
			}
		});

		var callback = function(dialog, success) {
			if(!success) {
				button.setBusy(false);
				return;
			}

			button.action.parameters[0].value = период.getValue();
			button.action.parameters[1].value = подразделение.getValue();
			button.runAction();
		};

		var dialog = new Z8.window.Window({ cls: 'отклонить-табель', header: 'Создать табель', icon: 'fa-reply', autoClose: true, controls: [период, подразделение], text: text, handler: callback, scope: this });
		dialog.open();
		dialog.okButton.setEnabled(false);
	},

	collectData: function() {
		var comparator = function(left, right) {
			return left.id < right.id ? -1 : (left.id > right.id ? 1 : 0);
		}

		var records = [].add(this.табель.getStore().getRecords()).sort(comparator);

		var data = '';
		for(var i = 0, length = records.length; i < length; i++) {
			var record = records[i];
			data += record.get(Кадры_Табели_ТабельControl.Сотрудник) + ';' + record.get(Кадры_Табели_ТабельControl.Должность) + ';' + record.get(Кадры_Табели_ТабельControl.Дни) + ';';
		}

		return MD5.hex(data);
	},

	selectCertificate: function(certificates, callback) {
		var store = new Z8.data.Store({ model: 'org.mtuci.empstats.cryptopro.certificate.Model', data: certificates });
		var fields = [
			{ name: 'owner', header: 'Владелец' },
			{ name: 'serialNumber', header: 'Серийный номер' },
			{ name: 'validFrom', header: 'Выпущен', type: Type.Date },
			{ name: 'validTill', header: 'Действует до', type: Type.Date },
			{ name: 'algorithm', header: 'Алгоритм' },
			{ name: 'provider', header: 'Провайдер' }
		];

		var listbox = new Z8.form.field.Listbox({ fields: fields, label: 'Выберите сертификат', store: store, tools: false, pagerMode: 'visible', checks: false, locks: false, flex: 1 });

		var dialogCallback = function(dialog, success) {
			callback(listbox.getSelection(), success);
		};

		var dialog = new Z8.window.Window({ cls: 'подписать-табель', header: 'Выберите сертификат', icon: 'fa-certificate', autoClose: true, controls: [listbox], handler: dialogCallback, scope: this });
		dialog.open();
	},

	onПодписать1: function(button) {
		var parameter = {
			data: this.collectData(),
			signature: '',
			owner: 'Тестовое подразделение',
			serialNumber: '452FA453EC6B543536',
			validFrom: new Date(2016, 6, 15).toISOString(),
			validTill: new Date(2020, 6, 14).toISOString(),
			algorithm: '',
			provider: ''
		};

		button.action.parameters[0].value = JSON.encode(parameter);
		button.runAction();
	},

	onПодписать: function(button) {
		CryptoPro.local_algorithm = CryptoPro.CADESCOM_CADES_BES;
		CryptoPro.local_detached = false;
		CryptoPro.local_encode = true;
		var me = this;

		var errorCallback = function(message) {
			button.setBusy(false);
			Application.message({ text: message, type: 'error' });
		};

		var loadCallback = function(certificates) {
			var selectCallback = function(certificate, success) {
				if(!success) {
					button.setBusy(false);
					return;
				}

				var signCallback = function(signature) {
					var parameter = {
						data: data,
						signature: signature,
						owner: certificate.get('owner'),
						serialNumber: certificate.get('serialNumber'),
						validFrom: certificate.get('validFrom').toISOString(),
						validTill: certificate.get('validTill').toISOString(),
						algorithm: certificate.get('algorithm'),
						provider: certificate.get('provider')
					}
					button.action.parameters[0].value = JSON.encode(parameter);
					button.runAction();
				}

				var data = me.collectData();
				CryptoPro.sign(certificate.id, data, signCallback, errorCallback);
			};

			me.selectCertificate(certificates, selectCallback);
		};

		button.setBusy(true);
		CryptoPro.loadCertificates(loadCallback, errorCallback);
	}
});