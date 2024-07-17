Z8.define('ru.sudrf.form.field.СтрокаТабеля', {
	extend: 'Z8.form.field.Control',
	shortClassName: 'СтрокаТабеля',

	statics: {
		/*        0    1    2    3    4    5    6    7    8    9    10   11   12   13   14    15    16   17    18    19    20    21    22   23   24    25    26*/
		values: ['1', '2', '3', '4', '5', '6', '7', '8', 'А', 'Б', 'В', 'Г', 'К', 'О', 'ОР', 'ОУ', 'П', 'РП', 'НД', 'ДР', 'ДО', 'БР', 'УБ', 'З', 'Т', 'НН', 'ОВ'],
		indices: {
			'1':  0,        '2': 1,      '3': 2,      '4': 3,
			'5':  4,        '6': 5,      '7': 6,      '8': 7,
		/*    RUS                         LAT                  */
			'А':  8,        'F': 8,      'A': 8,      'Ф': 8,
			'Б':  9,        ',': 9,      '<': 9,
			'В':  10,       'D': 10,     'B': 10,     'И': 10,
			'Г':  11,       'U': 11,
			'К':  12,       'R': 12,     'K': 12,     'Л': 12,
			'О':  13,       'J': 13,     'O': 13,     'Щ': 13,
			'ОР': 14,
			'ОУ': 15,
			'П':  16,       'G': 16,
			'РП': 17,
			'НД': 18, 'Н': 18,       'Y': 18,
			'ДР': 19, 'Д': 19,       'L': 19,
			'ДО': 20,
			'БР': 21,
			'УБ': 22, 'У': 22,
			'З':  23,       'P': 23,
			'Т':  24,
			'НН': 25,
			'ОВ': 26,
		},

		workingDays: ['1', '2', '3', '4', '5', '6', '7', '8', 'К', 'РП', 'ДР'],

		nextValue: function(value, forward, canBeEmpty) {
			var indices = Object.assign({}, СтрокаТабеля.indices);
			if (canBeEmpty)
				indices[String.ZeroWidthChar] = СтрокаТабеля.values.length;
			var index = indices[value];
			index = index === undefined ? (forward ? values.length : 0) : index;

			var values = СтрокаТабеля.values.slice();
			if (canBeEmpty)
				values.push(String.ZeroWidthChar);
			if(forward)
				return values[(index < values.length - 1 ? index : -1) + 1];

			return values[(index > 0 ? index : values.length) - 1];
		},

		valueByFirstChar: function(firstChar) {
			var index = СтрокаТабеля.indices[firstChar.toUpperCase()];
			return index != null ? СтрокаТабеля.values[index] : null;
		},

		isWorkingDay: function(value) {
			return СтрокаТабеля.workingDays.indexOf(value) != -1;
		}
	},

	initComponent: function() {
		this.callParent();
		this.cls = DOM.parseCls(this.cls).pushIf('строка-табеля');

		this.setValue(this.value);
		this.selected = -1;
	},

	setValue: function(value, dispayValue) {
		value = String.isString(value) ? JSON.parse(value) : value;
		this.month = value != null ? Parser.date(value.date) : new Date();
		this.daysInMonth = value != null ? this.month.getDaysInMonth() : 0;

		this.callParent(value, dispayValue);

		this.updateView();
	},

	getValue: function() {
		var value = this.callParent();
		return value != null ? JSON.encode(value) : null;
	},

	cellMarkup: function(cls, i) {
		cls = 'день' + (cls != null ? ' ' + cls : '');
		return { cls: cls , day: i, cn: [{ cls: 'число', число: i, html: i }, { cls: 'часы план', html: String.ZeroWidthChar }, { cls: 'часы факт', часы: i, html: String.ZeroWidthChar }]};
	},

	controlMarkup: function() {
		var days = [];

		var headers = { cls: 'headers', cn: [{ cls: 'число', html: 'Даты' }, { cls: 'часы план', html: 'План' }, { cls: 'часы факт', html: 'Факт' }]};
		days.push(headers);

		for(var i = 1; i <= 15; i++) {
			var day = { cls: 'день', day: i, cn: [{ cls: 'число', число: i, html: i }, { cls: 'часы план', html: String.ZeroWidthChar }, { cls: 'часы факт', часы: i, html: String.ZeroWidthChar }]};
			days.push(day);
		}

		var сумма15 = ['Σ', { tag: 'span', html: '15' }];
		var сумма31 = ['Σ', { tag: 'span', html: '31' }];

		day = { cls: 'день сумма сумма-15', cn: [{ cls: 'число', cn: сумма15 }, { cls: 'часы план', html: String.ZeroWidthChar }, { cls: 'часы факт', часы: i, html: String.ZeroWidthChar }]};
		days.push(day);

		for(var i = 16; i <= 31; i++) {
			var day = { cls: 'день', day: i, cn: [{ cls: 'число', число: i, html: i }, { cls: 'часы план', html: String.ZeroWidthChar }, { cls: 'часы факт', часы: i, html: String.ZeroWidthChar }]};
			days.push(day);
		}

		day = { cls: 'день сумма сумма-31', cn: [{ cls: 'число', cn: сумма31 }, { cls: 'часы план', html: String.ZeroWidthChar }, { cls: 'часы факт', часы: i, html: String.ZeroWidthChar }]};
		days.push(day);

		var focusable = this.isEnabled() && !this.isReadOnly(); 
		return [{ cls: 'control', cn: days, tabIndex: focusable ? 0 : null }];
	},

	completeRender: function() {
		this.callParent();

		this.control = this.selectNode('.строка-табеля .control');
		this.дни = this.queryNodes('.строка-табеля .control .день:not(.сумма)');
		this.числа = this.queryNodes('.строка-табеля .control .день:not(.сумма)>.число');
		this.план = this.queryNodes('.строка-табеля .control .день:not(.сумма)>.план');
		this.факт = this.queryNodes('.строка-табеля .control .день:not(.сумма)>.факт');

		this.план15 = this.selectNode('.строка-табеля .control .сумма-15>.план');
		this.факт15 = this.selectNode('.строка-табеля .control .сумма-15>.факт');
		this.план31 = this.selectNode('.строка-табеля .control .сумма-31>.план');
		this.факт31 = this.selectNode('.строка-табеля .control .сумма-31>.факт');

		DOM.on(this, 'click', this.onClick, this);
		DOM.on(this, 'keyDown', this.onKeyDown, this);
		DOM.on(this, 'keyPress', this.onKeyPress, this);

		this.updateView();
	},

	onDestroy: function() {
		this.callParent();

		DOM.un(this, 'click', this.onClick, this);
		DOM.un(this, 'keyDown', this.onKeyDown, this);
		DOM.un(this, 'keyPress', this.onKeyPress, this);

		this.control = this.дни = this.числа = this.план = this.факт = null;
	},

	focus: function() {
		return this.isEnabled() ? DOM.focus(this.control) : false;
	},

	updateView: function(sumsOnly) {
		if(this.dom == null)
			return;

		var enabled = this.isEnabled();

		var дни = this.дни;
		var числа = this.числа;
		var план = this.план;
		var факт = this.факт;

		var строка = this.value;
		var date = new Date(this.month);
		var daysInMonth = this.daysInMonth;

		var план15 = 0;
		var факт15 = 0;
		var план31 = 0;
		var факт31 = 0;

		for(var i = 0; i < 31; i++) {
			var dayOfWeek = i < daysInMonth ? date.getDayOfWeek() : 0;
			var планValue = i < daysInMonth ? строка.план[i + 1] : null;
			var фактValue = i < daysInMonth ? строка.факт[i + 1] : null;

			if(СтрокаТабеля.isWorkingDay(планValue)) {
				план15 += i < 15 ? 1 : 0;
				план31 += 1;
			}

			if(СтрокаТабеля.isWorkingDay(фактValue)) {
				факт15 += i < 15 ? 1 : 0;
				факт31 += 1;
			}

			if(!sumsOnly) {
				DOM.swapCls(дни[i], dayOfWeek >= 5, 'weekend');
				DOM.swapCls(дни[i], планValue == null, 'disabled');
				DOM.swapCls(план[i], планValue != фактValue && фактValue != String.ZeroWidthChar, 'change');
				DOM.setValue(план[i], планValue || String.ZeroWidthChar);
				DOM.setValue(факт[i], фактValue || String.ZeroWidthChar);
			}

			date.addDay(1);
		}

		DOM.setValue(this.план15, план15 || String.ZeroWidthChar);
		DOM.setValue(this.факт15, факт15 || String.ZeroWidthChar);
		DOM.setValue(this.план31, план31 || String.ZeroWidthChar);
		DOM.setValue(this.факт31, факт31 || String.ZeroWidthChar);

		if(!sumsOnly)
			this.select(строка != null ? (this.selected != -1 ? this.selected : 0) : null);
	},

	setReadOnly: function(readOnly) {
		this.callParent(readOnly);
		var focusable = this.isEnabled() && !readOnly;
		DOM.setTabIndex(this, focusable ? 0 : -1);
	},

	getCell: function(index) {
		return this.факт[index];
	},

	getSelectedCell: function() {
		return this.getCell[this.selected];
	},

	getCellValue: function(index) {
		return DOM.getValue(this.getCell(index));
	},

	getSelectedValue: function() {
		return this.getCellValue(this.selected);
	},

	setCellValue: function(index, value) {
		DOM.setValue(this.факт[index], value);
		DOM.swapCls(this.план[index], (this.value.план[index + 1] || String.ZeroWidthChar) != value, 'change');
		this.value.факт[index + 1] = value;
		this.updateView(true);
	},

	setSelectedValue: function(value) {
		this.setCellValue(this.selected, value);
	},

	isSelectable: function(index) {
		return index < this.daysInMonth && this.value.план[index + 1] != null;
	},

	select: function(index) {
		if(index == -1/* && !this.isSelectable(index)*/)
			return;

		if(index != this.selected) {
			var факт = this.факт;

			var item = факт[this.selected];
			DOM.removeCls(item, 'active');

			this.selected = index;

			if(index != null)
				DOM.addCls(факт[index], 'active');
		}
	},

	selectNext: function(start, forward) {
		var daysInMonth = this.daysInMonth;

		var index = start;
		if(index == null) {
			index = forward ? -1 : daysInMonth;
			start = forward ? 0 : daysInMonth - 1;
		}

		do {
			if(forward)
				index = (index < daysInMonth - 1 ? index : -1) + 1;
			else
				index = (index > 0 ? index : daysInMonth) - 1;

			if(this.isSelectable(index) || (this.value.факт[index + 1] ? this.value.факт[index + 1] != String.ZeroWidthChar : false)) {
				this.select(index);
				return true;
			}
		} while(index != start);

		return false;
	},

	onClick: function(event, target) {
		var index = target.getAttribute('часы');
		if(index != null)
			this.select(parseInt(index) - 1);
	},

	onKeyDown: function(event, target) {
		var key = event.getKey();

		if(this.isReadOnly() || !this.isEnabled())
			return;

		if(key == Event.LEFT || key == Event.RIGHT) {
			this.selectNext(this.selected, key == Event.RIGHT);
			event.stopEvent();
		} else if(key == Event.HOME || key == Event.END) {
			this.selectNext(-1, key == Event.HOME);
			event.stopEvent();
		} else if(this.isEnabled() && !this.isReadOnly() && (key == Event.UP || key == Event.DOWN)) {
			if(this.selected != -1 || this.selectNext(this.selected, true)) {
				var value = this.getSelectedValue();
				this.setSelectedValue(СтрокаТабеля.nextValue(value, key == Event.DOWN, DOM.hasCls(this.дни[this.selected], 'disabled')));
			}
			event.stopEvent();
		}
	},

	onKeyPress: function(event, target) {
		var value = СтрокаТабеля.valueByFirstChar(String.fromCharCode(event.getKey()));
		if(value != null)
			this.setSelectedValue(value);
	}
});