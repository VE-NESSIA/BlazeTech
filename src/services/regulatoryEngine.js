import nigeriaRules from '../rules/nigeria.rules.js';

export function evaluateCompliance(customer) {
    return nigeriaRules(customer);
}
