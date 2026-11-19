import unittest
from src.assistente import calcular, carregar, responder
class TesteCalculos(unittest.TestCase):
    def setUp(self):
        self.d=carregar()
        self.r=calcular(self.d)
    def test_potencia(self): self.assertEqual(self.r["potencia_W"],200)
    def test_consumo(self): self.assertEqual(self.r["consumo_kWh"],144)
    def test_custo(self): self.assertAlmostEqual(self.r["custo_rede_R"],129.6)
    def test_solar(self): self.assertAlmostEqual(self.r["geracao_solar_kWh"],101.25)
    def test_economia(self): self.assertAlmostEqual(self.r["economia_solar_R"],91.125)
    def test_eficiencia(self): self.assertAlmostEqual(self.r["consumo_eficiente_kWh"],115.2)
    def test_resposta(self): self.assertIn("144.00",responder("Quanto consome?",self.d,self.r))
if __name__=="__main__": unittest.main()
