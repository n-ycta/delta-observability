import{runtime}from'./runtime.mjs';import{DeltaError,allowed}from'./delta-sdk.mjs';import{createEventJournal}from'./events.mjs';import{createTelemetry}from'./telemetry.mjs';import{queryMetric}from'./metrics.mjs';
export async function setupObservability(client){
 const storage=process.env.STORAGE_COMPONENT||'storage',events=await createEventJournal(client),monitor=createTelemetry(client,storage),stopEvents=events.start(),stopMonitor=monitor.start();
 return{handlers:{
 'observability.history':async a=>monitor.history(a.id,a.rangeMs),
 'observability.uptime':async a=>monitor.uptime(a.id,a.days),
 'observability.query':async a=>queryMetric(client,storage,a.query),
 'observability.events':async(a={},c)=>events.list(a.query||{},c,a._locale||'en',[]),
 'observability.audit':async(a,c)=>{
  if(!/^web\.(plugins_(enable|install|update|uninstall|settings|action)|nodes_(command|pair|remove)|access_(create|revoke)|dashboards_(save|delete)|updates_(settings|install))$/.test(a.action||'')||!allowed(c,a.action))throw new DeltaError('forbidden','Invalid audit action');
  await events.audit(a.action,{id:typeof a.target==='string'?a.target.slice(0,200):'local'},c,a.errorCode?{code:/^[a-z_]{1,60}$/.test(a.errorCode)?a.errorCode:'operation_failed'}:undefined);return{recorded:true};
 },
 'observability.status':async()=>{const a=monitor.status();return{settings:{},activity:{...a,rateLabel:{en:'records/min',ru:'записей/мин'}},notices:a.error?[{id:'telemetry',severity:'warn',message:'Node telemetry cannot be persisted to Storage.',localizations:{ru:'История узлов не записывается: проверьте хранилище.'}}]:[]}}
 },stop:async()=>{stopMonitor();stopEvents();await events.queue}};
}
if(process.env.DELTA_COMPONENT_ID==='observability'||process.argv[1]&&import.meta.url===(await import('node:url')).pathToFileURL(process.argv[1]).href)await runtime(setupObservability);
