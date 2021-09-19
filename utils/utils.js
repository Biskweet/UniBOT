import { boosterRoleId, modoRoleId } from './variables.js';


export function isBooster(member) {
    return !!member.roles.cache.get(boosterRoleId);
}


export function isModo(member) {
    return !!member.roles.cache.get(modoRoleId);
}
