function CLEnablementStatusManager () {
  this.status = false;
}

CLEnablementStatusManager.prototype.setStatus = status => {
  this.status = status;
}; 

CLEnablementStatusManager.prototype.getStatus = () => this.status;

const _CLEnablementStatusManager = new CLEnablementStatusManager();

module.exports.CLEnablementStatusManager = _CLEnablementStatusManager;