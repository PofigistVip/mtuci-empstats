Z8.define('org.zenframework.z8.template.User', {
	extend: 'Z8.application.User',

	hasPerm: function(permId) {
		return this.hasRole(permId);
	},

	табельщик: function() {
		return this.hasPerm('0DD421E3-BCBC-4E94-80CC-BF3703316C1D');
	},

	кадровик: function() {
		return this.hasPerm('E2052AC6-9604-4FB8-944B-932067402458');
	},

	бухгалтер: function() {
		return this.hasPerm('EA6666C7-03E0-4737-8596-7CB17BE7BB5F');
	},
});