/**
 * Created by tushar.mathur on 02/07/16.
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Status = exports.Help = undefined;

var _humanizePlus = require('humanize-plus');

var _humanizePlus2 = _interopRequireDefault(_humanizePlus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Help = exports.Help = `		
 Usage		
 	  mtd		
 		
 	Options		
 	  --url            The url of the file that needs to be downloaded		
 	  --file           Path to the .mtd file for resuming failed downloads		
 		
 	Examples		
 	  mtd --url http://www.sample-videos.com/video/mp4/720/big_buck_bunny_720p_1mb.mp4		
 	  mtd --file big_buck_bunny_720p_1mb.mp4.mtd		
   `;
const Status = exports.Status = size => `
SIZE: ${ _humanizePlus2.default.filesize(size) }
`;
//# sourceMappingURL=Messages.js.map