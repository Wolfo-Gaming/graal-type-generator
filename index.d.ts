export type Class = {
    methods: Method[],
    fields: Field[],
    constructors: Constructor[],
    extends: SuperClass[],
    implements: Interface[],
    name: string
}
type SuperClass = string
type Interface = string
type Constructor = {
    params: Parameter[],
    name: string,
 }
type Field = {
    name: string,
    type: string,
}
type Method = {
   params: Parameter[],
   name: string,
   returns: string
}
type Parameter = {
    name: string,
    type: string
}
