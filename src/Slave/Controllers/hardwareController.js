/*module gerant la page d'acceuil*/
let controller = require('./controller')
const os = require('os');
let hardwareController = class hardwareController{
  constructor(req, res, next) {
    this.req=req;
    this.res=res;
    this.next=next;
    this.controller = new controller(req, res, next);
  }
  getinfos(){
    let infos = {
      "architecture":os.arch(),
      "cpus":os.cpus(),
      "homedir":os.homedir(),
      "hostname":os.hostname(),
      "freemem":os.freemem(),
      "networkInterfaces":os.networkInterfaces(),
      "platform":os.platform(),
      "release":os.release(),
      "tmpdir":os.tmpdir(),
      "totalmem":os.totalmem(),
      "uptime":os.uptime()
    }
    console.log(infos);
    this.res.send(infos)
  }
}

module.exports = hardwareController;
