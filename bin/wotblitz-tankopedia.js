#!/usr/bin/env node

var program = require('commander');
var request = require('../lib/request.js')('tankopedia');
var types = require('../lib/types.js');
var writer = require('../lib/writer.js')({depth: 4});

module.exports = {
  vehicles: vehicles,
  characteristics: characteristics,
  characteristic: characteristic,
  modules: modules,
  provisions: provisions,
  info: info,
  achievements: achievements,
  crewskills: crewskills
};

if (require.main === module) {
  main(
    program
      .option('-v, --vehicles [tank_ids]', 'list of vehicles with default profile (endpoint)', types.numbers)
      .option(
        '--characteristics <tank_id>',
        '[DEPRECATED] all or default characteristics of one tank (endpoint)',
        Number
      )
      .option('-c, --characteristic <tank_id>', 'get the characterists given the module ids (endpoint)', Number)
      .option(
        '-m, --modules [module_ids]',
        'list of available modules, such as guns, engines, etc. (endpoint)',
        types.numbers
      )
      .option(
        '-p, --provisions [provision_ids]',
        'list of available equipment and consumables (endpoint)',
        types.numbers
      )
      .option('-i, --info', 'overview of the tankopedia (endpoint)')
      .option('-a, --achievements', 'description of all achievements (endpoint)')
      .option('-s, --crewskills [skill_ids]', 'information about crew skills (endpoint)', types.fields)
      .option('-n, --nations <nations>', 'selection of nation(s)', types.fields, [])
      .option('-t, --tank-ids <tank_ids>', 'selection of tank_id(s)', types.numbers, [])
      .option('-f, --fields <fields>', 'selection of field(s)', types.fields, [])
      .option('-d, --default', 'show only the default characteristics')
      .option('-T, --provision-type <equipment|optionalDevice>', 'select consumable or equipment', types.provision)
      .option('-M, --module <[estg]number>', 'select which module to equip for characteric', types.modules, {})
      .option('-C, --vehicletype <types>', 'select crews skills based on vehicle type(s)', types.list, [])
      .parse(process.argv)
  );
}

function main(opts) {
  if (opts.vehicles) vehicles(opts.vehicles, opts.nations, opts.fields, writer.callback);

  if (opts.characteristics) {
    characteristics(
      opts.characteristics,
      // opts.default HACKS: commander does not specify values for on-off flags
      Number(opts.default || false),
      opts.fields,
      writer.callback
    );
  }

  if (opts.characteristic) {
    characteristic(
      opts.characteristic,
      opts.module.engine,
      opts.module.gun,
      opts.module.suspension,
      opts.module.turret,
      opts.fields,
      writer.callback
    );
  }

  if (opts.modules) modules(opts.modules, opts.fields, writer.callback);

  if (opts.provisions) provisions(opts.provisions, opts.tankIds, opts.provisionType, opts.fields, writer.callback);

  if (opts.info) info(opts.fields, writer.callback);

  if (opts.achievements) achievements(opts.fields, writer.callback);

  if (opts.crewskills) crewskills(opts.crewskills, opts.vehicletype, opts.fields, writer.callback);
}

function vehicles(tankIds, nations, fields, callback) {
  request('vehicles', {
    tank_id: Array.isArray(tankIds) ? tankIds.join(',') : null,
    nation: nations.join(','),
    fields: fields.join(',')
  }, callback);
}

function characteristics(tankId, isDefault, fields, callback) {
  request('characteristics', {
    tank_id: tankId,
    is_default: isDefault,
    fields: fields.join(',')
  }, callback);
  console.warn('WARN: Method has been deprecated for removal.');
}

function characteristic(tankId, engineId, gunId, suspensionId, turretId, fields, callback) {
  request('characteristic', {
    tank_id: tankId,
    engine_id: engineId,
    gun_id: gunId,
    suspension_id: suspensionId,
    turret_id: turretId,
    fields: fields.join(',')
  }, callback);
}

function modules(moduleIds, fields, callback) {
  request('modules', {
    module_id: Array.isArray(moduleIds) ? moduleIds.join(',') : null,
    fields: fields.join(',')
  }, callback);
}

function provisions(provisionIds, tankIds, type, fields, callback) {
  request('provisions', {
    provision_id: Array.isArray(provisionIds) ? provisionIds.join(',') : null,
    tank_id: tankIds.join(','),
    type: type,
    fields: fields.join(',')
  }, callback);
}

function info(fields, callback) {
  request('info', {
    fields: fields.join(',')
  }, callback);
}

function achievements(fields, callback) {
  request('achievements', {
    fields: fields.join(',')
  }, callback);
}

function crewskills(skillIds, vehicleTypes, fields, callback) {
  request('crewskills', {
    skill_id: Array.isArray(skillIds) ? skillIds.join(',') : null,
    vehicle_type: vehicleTypes.join(','),
    fields: fields.join(',')
  }, callback);
}
