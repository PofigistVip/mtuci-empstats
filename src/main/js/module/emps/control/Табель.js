Z8.define('org.mtuci.empstats.module.emps.control.Табель.Item', {
	extend: 'Z8.list.Item',

	initComponent: function() {
		this.callParent();
	},

	columnsMarkup: function() {
		var columns = [];

		var cls = 'column';

		var record = this.getRecord();
		var фио = record.get(Кадры_Табели_ТабельControl.Сотрудник);
		var должность = record.get(Кадры_Табели_ТабельControl.Должность);

		var text = [{ cls: 'фио', html: фио || '' }, { cls: 'должность', html: должность || '' }];
		var title = (фио || '') + '\n' + (должность || '');

		text = { tag: 'span', cls: 'text', cn: text };
		var cell = { cls: 'cell', cn: [text] };
		columns.push({ tag: 'td', cls: cls + ' string', field: 0, cn: [cell], title: title });

		var табель = record.get(Кадры_Табели_ТабельControl.Дни);
		this.строка = new СтрокаТабеля({ name: Кадры_Табели_ТабельControl.Дни, value: табель, readOnly: true });
		text = { tag: 'span', cls: 'text', cn: [this.строка.htmlMarkup()] };
		cell = { cls: 'cell', cn: [text] };
		columns.push({ tag: 'td', cls: cls + ' дни', field: 1, cn: [cell] });

		return columns;
	},

	subcomponents: function() {
		return [this.строка];
	},

	setText: function(index, text) {
		if(index == Кадры_Табели_ТабельControl.ДниIndex)
			this.строка.setValue(text);
		else
			this.callParent(index, text);
	}
});

Z8.define('org.mtuci.empstats.module.emps.control.Табель', {
	extend: 'Z8.form.field.Listbox',
	shortClassName: 'Кадры_Табели_ТабельControl',

	statics: {
		Сотрудник: 'табельСотрудника.шр.сотрудник.фио',
		Должность: 'табельСотрудника.шр.должность.name',
		Дни: 'табельСотрудника.дни',

		ДниIndex: 1
	},

	editable: true,
	itemType: 'org.mtuci.empstats.module.emps.control.Табель.Item',

	constructor: function(config) {
		var editor = new СтрокаТабеля({ name: Кадры_Табели_ТабельControl.Дни, enterOnce:  true });

		this.сотрудник = { header: 'Сотрудник', type: 'string', name: Кадры_Табели_ТабельControl.Сотрудник, width: 50 };
		this.должность = { header: 'Должность', type: 'string', name: Кадры_Табели_ТабельControl.Должность };
		this.дни = { header: 'Табель', name: Кадры_Табели_ТабельControl.Дни, width: 500, sortable: false, editable: true, editor: editor, type: 'string' };

		config.fields = [this.сотрудник, this.дни];
		config.cls = DOM.parseCls(config.cls).pushIf('табель');

		this.callParent(config);

		var store = this.getStore();
		var accessFn = function() { return false; };
		store.hasCreateAccess = accessFn;
		store.hasCopyAccess = accessFn;
		store.hasDestroyAccess = accessFn;
	}
});