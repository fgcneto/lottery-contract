import './App.css'
import React, { useEffect, useState } from 'react'
import lottery from './lottery'
import web3 from './web3'

const App: React.FC = () => {
  const [manager, setManager] = useState('')
  const [players, setPlayers] = useState([])
  const [balance, setBalance] = useState('')
  const [value, setValue] = useState('')
  const [message, setMessage] = useState('')
  const [amount, setAmount] = useState('')
  const [currentWinner, setCurrentWinner] = useState('')
  const [reload, setReload] = useState(false)
  const [contract, setContract] = useState('')

  useEffect(() => {
    const init = async () => {
      const manager = await lottery.methods.manager().call()
      const players = await lottery.methods.getPlayers().call()
      const amount = await lottery.methods.getAmount().call()
      const currentWinner = await lottery.methods.getCurrentWinner().call()

      setManager(manager)
      setPlayers(players)
      setBalance(await web3.eth.getBalance(lottery.options.address))
      setAmount(amount)
      setCurrentWinner(currentWinner)
      setContract(lottery.options.address)
    }
    init()
  }, [reload])

  const submitForm = async (e: any) => {
    e.preventDefault()
    const accounts = await web3.eth.getAccounts()
    setMessage('Aguardando o sucesso da transação...')

    await lottery.methods.enter(value).send({
      from: accounts[0],
      value: web3.utils.toWei(value, 'wei')
    })
    setValue('')
    setMessage('Foi inscrito!')
    setReload(!reload)
  }

  const onPickWinner = async () => {
    const accounts = await web3.eth.getAccounts()
    setMessage('Escolhendo um vencedor...')
    setMessage('Aguardando o sucesso da transação...')

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    })

    setMessage('Foi escolhido um vencedor!')
    setReload(!reload)
  }

  const onGetPrize = async () => {
    const accounts = await web3.eth.getAccounts()

    // setCurrentAccount(accounts[0]);
    setMessage('Aguardando o sucesso da transação...')

    await lottery.methods.getPrize().send({
      from: accounts[0]
    })

    setMessage('Prêmio recebido!')
  }

  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>Endereço do Contrato: {contract}</p>
      <p>Este contrato é gerido por {manager}</p>
      <p>
        Existem atualmente {players.length} compradores, competindo para ganhar:{' '}
        {web3.utils.fromWei(balance, 'wei')} wei!
      </p>
      <hr />
      <form onSubmit={submitForm}>
        <h4>Quer tentar a sua sorte?</h4>
        <div>
          <label>Quantidade de wei </label>
          <input
            style={{ marginLeft: '1vw' }}
            value={value}
            onChange={e => setValue(e.target.value)}
          />
          <br />
          <br />
          <button>Comprar Rifa</button>
        </div>
      </form>

      <hr />

      <div>
        <h4>Sortear</h4>
        <button onClick={onPickWinner}>Realizar sorteio!</button>
      </div>
      <div>
        <h4>Premiação: {amount} Wei</h4>
      </div>
      <div>
        <h4>Receber Prêmio</h4>
        <button onClick={onGetPrize}>Receber</button>
      </div>
      <div>
        <h4>Vencedor </h4>
        <p>Vencedor: {currentWinner}</p>
      </div>
      <div>
        <h4>Compradores </h4>
        <ul>
          {players.map(item => {
            return <li>Comprador: {item}</li>
          })}
        </ul>
      </div>
      <hr />
      <h1>{message}</h1>
    </div>
  )
}
export default App
