"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateGroupDto = void 0;
var class_validator_1 = require("class-validator");
var CreateGroupDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _targetAmount_decorators;
    var _targetAmount_initializers = [];
    var _targetAmount_extraInitializers = [];
    var _durationMonths_decorators;
    var _durationMonths_initializers = [];
    var _durationMonths_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateGroupDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.targetAmount = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _targetAmount_initializers, void 0));
                this.durationMonths = (__runInitializers(this, _targetAmount_extraInitializers), __runInitializers(this, _durationMonths_initializers, void 0));
                __runInitializers(this, _durationMonths_extraInitializers);
            }
            return CreateGroupDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, class_validator_1.IsString)()];
            _targetAmount_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1000)];
            _durationMonths_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(48)];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _targetAmount_decorators, { kind: "field", name: "targetAmount", static: false, private: false, access: { has: function (obj) { return "targetAmount" in obj; }, get: function (obj) { return obj.targetAmount; }, set: function (obj, value) { obj.targetAmount = value; } }, metadata: _metadata }, _targetAmount_initializers, _targetAmount_extraInitializers);
            __esDecorate(null, null, _durationMonths_decorators, { kind: "field", name: "durationMonths", static: false, private: false, access: { has: function (obj) { return "durationMonths" in obj; }, get: function (obj) { return obj.durationMonths; }, set: function (obj, value) { obj.durationMonths = value; } }, metadata: _metadata }, _durationMonths_initializers, _durationMonths_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateGroupDto = CreateGroupDto;
