import { SecurityAuditItem } from '../types';

export const SECURITY_AUDIT_DATA: SecurityAuditItem[] = [
  {
    id: 'race-condition-dupe',
    title: 'Race-Condition Multi-Click Item Duplication',
    threatLevel: 'CRITICAL',
    skriptFlaw: 'The Skript executed `remove {_total} from balance` and `give {_amt} of {_it}` without atomic thread locks. Cheat clients or auto-clickers sending 50 packets in 1 tick could duplicate items before balance was updated or cause negative balance desyncs.',
    arcedgeFix: 'Implemented `ConcurrentHashMap<UUID, AtomicBoolean> activeTransactions` with strict `compareAndSet(false, true)` atomic locking. Only one transaction can process per player at any nanosecond.',
    technicalMechanism: 'Atomic CAS (Compare-And-Swap) transaction barrier + 350ms click cooldown throttling.'
  },
  {
    id: 'inventory-drop-exploit',
    title: 'Inventory Full Overflow & Ground Spill Exploit',
    threatLevel: 'HIGH',
    skriptFlaw: 'Skript used `give {_amt} of {_it} to {_p}` unconditionally. When inventory is full, Skript drops items on the ground or voids them, allowing bad actors to cause severe entity drop lag, despawns, or item collision dupes.',
    arcedgeFix: 'Pre-flight calculation: checks available storage contents and stack capacities *before* touching Vault economy. If items cannot fit, transaction is rejected with a clear message and 0 coins are taken.',
    technicalMechanism: 'Pre-transaction slot reservation algorithm with safety overflow fallback.'
  },
  {
    id: 'command-injection-bypass',
    title: 'Unauthenticated Command Parameter Injection',
    threatLevel: 'HIGH',
    skriptFlaw: 'Commands `/shoppick <text> <text>` and `/shopbuy <text>` were executable directly via console or chat. Any player who knew the command format could trigger backend state without opening any inventory.',
    arcedgeFix: 'Direct command execution is forbidden. All operations require authenticated InventoryHolder sessions or Dialog API cryptographic tokens. Chat arguments are strictly type-validated.',
    technicalMechanism: 'InventoryHolder & DialogSession validation filters; unlinked invocations are discarded.'
  },
  {
    id: 'integer-overflow-attack',
    title: 'Integer Overflow Math Attack (Negative Balances)',
    threatLevel: 'CRITICAL',
    skriptFlaw: 'Skript parsed integer from text without bounds checking (`set {_amt} to arg-1 parsed as integer`). Sending `2147483647` multiplied by high price results in 32-bit signed overflow to negative numbers, crediting free money to the player!',
    arcedgeFix: 'Uses `Math.multiplyExact()` with hard upper caps (`max-purchase-quantity: 2304` = 36 stacks) and strict double precision validation. Any negative or out-of-bound quantity is instantly rejected.',
    technicalMechanism: 'ArithmeticException interceptor & boundary clamping.'
  },
  {
    id: 'server-thread-freeze',
    title: 'Main Server Thread Freeze / Variable Spam',
    threatLevel: 'HIGH',
    skriptFlaw: 'Skript stored all player shop items in non-indexed global variables (`{myshop::*}`) and looped through the entire whitelist on the main server thread during dynamic dialog searches, dropping TPS to 5.',
    arcedgeFix: 'Full async persistence with HikariCP connection pool on an embedded SQLite database (`shops.db`). Main server thread reads from a non-blocking ConcurrentHashMap cache; writes are batched and saved asynchronously.',
    technicalMechanism: 'Async CompletableFuture I/O + HikariCP connection pool + memory cache.'
  },
  {
    id: 'lack-of-permission-scaling',
    title: 'Lack of Slot Tiering & Permission Support',
    threatLevel: 'MEDIUM',
    skriptFlaw: 'Hardcoded 10 slots with no permission checks. Players could not have tier progression (e.g. VIP 10 slots, MVP 20 slots, Elite 32 slots).',
    arcedgeFix: 'Full LuckPerms 5.4 direct API integration supporting `shopslot.1` through `shopslot.32`. Seamless fallback to Bukkit permissions if LuckPerms is not installed.',
    technicalMechanism: 'LuckPerms Contextual User Query + `player.hasPermission("shopslot." + slot)` hierarchy.'
  }
];
