import WalletConnect from './components/WalletConnections';
import BalanceDisplay from './components/BalanceDisplay';
import TransactionList from './components/TransactionList';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>UAS - Web3 Donation App</h1>
        <WalletConnect />
        <BalanceDisplay />
        <TransactionList />
      </header>
    </div>
  );
}

export default App;
